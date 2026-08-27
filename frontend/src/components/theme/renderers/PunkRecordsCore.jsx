"use client";

/**
 * PunkRecordsCore (v2 - Adaptive Color Management)
 * -----------------------------------------------
 * A motion-preset renderer for VegaRecords' AnimatedBackground system.
 *
 * Color Management Highlights:
 *  - Dynamically reads CSS custom properties (--primary, --secondary) from
 *    document.documentElement, reacting instantly to all theme presets.
 *  - Parses Hex (#fff, #7c5cff) and RGB/RGBA (rgb(124,92,255)) strings gracefully.
 *  - Automatically adapts blending modes (source-over vs. lighter), node alpha,
 *    and stardust color when toggling between Light and Dark modes for optimal contrast.
 */

import { useEffect, useRef } from "react";
import { useThemeStore } from "@/stores/theme.store";

/* ------------------------------------------------------------------ */
/* Renderer class — plain Canvas2D, no framework dependency           */
/* ------------------------------------------------------------------ */

export class PunkRecordsCoreRenderer {
    canvas = null;
    ctx = null;
    dpr = 1;
    width = 0;
    height = 0;
    center = { x: 0, y: 0 };
    coreRadius = 0;

    nodes = [];
    satellites = [];
    pulses = [];
    stars = [];
    clusterCount = 5;

    rafId = null;
    startTime = performance.now();
    lastFrameTime = performance.now();
    prefersReducedMotion = false;

    primary = "#7c5cff";
    secondary = "#22d3ee";
    primaryRgb = [124, 92, 255];
    secondaryRgb = [34, 211, 238];
    isLight = false;

    constructor(canvas) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("PunkRecordsCore: 2D context unavailable");
        this.ctx = ctx;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        this.readThemeColors();
        this.resize();
        this.seed();
    }

    readThemeColors() {
        if (typeof window === "undefined") return;
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        const p = styles.getPropertyValue("--primary").trim();
        const s = styles.getPropertyValue("--secondary").trim();

        this.isLight = root.classList.contains("light");
        if (p) this.primary = p;
        if (s) this.secondary = s;
        this.primaryRgb = this.hexToRgbTuple(this.primary);
        this.secondaryRgb = this.hexToRgbTuple(this.secondary);
    }

    hexToRgbTuple(colorStr) {
        if (!colorStr) return [124, 92, 255];
        let str = colorStr.trim();
        if (str.startsWith("rgb")) {
            const matches = str.match(/\d+/g);
            if (matches && matches.length >= 3) {
                return [parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2])];
            }
        }
        let h = str.replace("#", "");
        if (h.length === 3) h = h.split("").map((c) => c + c).join("");
        const int = parseInt(h, 16);
        if (Number.isNaN(int)) return [124, 92, 255];
        return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
    }

    rgba([r, g, b], a) {
        return `rgba(${r},${g},${b},${a})`;
    }

    /** Linear interpolation between primary and secondary, for cluster hues */
    clusterColor(clusterId) {
        const frac = clusterId / Math.max(1, this.clusterCount - 1);
        const [pr, pg, pb] = this.primaryRgb;
        const [sr, sg, sb] = this.secondaryRgb;
        return [
            Math.round(pr + (sr - pr) * frac),
            Math.round(pg + (sg - pg) * frac),
            Math.round(pb + (sb - pb) * frac),
        ];
    }

    resize = () => {
        const rect = this.canvas.parentElement?.getBoundingClientRect() ?? {
            width: typeof window !== "undefined" ? window.innerWidth : 1920,
            height: typeof window !== "undefined" ? window.innerHeight : 1080,
        };
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

        this.center = { x: this.width / 2, y: this.height / 2 };
        this.coreRadius = Math.max(48, Math.min(this.width, this.height) * 0.08);
        this.seedStars();
    };

    seedStars() {
        const count = Math.round((this.width * this.height) / 9000);
        this.stars = Array.from({ length: count }, () => ({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 1.2 + 0.3,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.3 + Math.random() * 0.6,
        }));
    }

    seed() {
        const nodeCount = Math.round(
            Math.max(20, Math.min(this.width, this.height) / 20)
        );
        const maxOrbit = Math.min(this.width, this.height) * 0.42;
        const minOrbit = this.coreRadius * 2.4;

        this.nodes = Array.from({ length: nodeCount }, (_, i) => {
            const clusterId = i % this.clusterCount;
            const clusterAngle = (clusterId / this.clusterCount) * Math.PI * 2;
            const angleJitter = (Math.random() - 0.5) * (Math.PI / this.clusterCount) * 1.6;
            return {
                angle: clusterAngle + angleJitter,
                angularSpeed: (Math.random() * 0.05 + 0.012) * (Math.random() < 0.5 ? -1 : 1),
                radius: minOrbit + Math.random() * (maxOrbit - minOrbit),
                tilt: 0.35 + Math.random() * 0.35,
                radiusJitterPhase: Math.random() * Math.PI * 2,
                size: 2.2 + Math.random() * 3,
                clusterId,
                pulsePhase: Math.random() * Math.PI * 2,
            };
        });

        this.satellites = Array.from({ length: 12 }, () => ({
            angle: Math.random() * Math.PI * 2,
            angularSpeed: (Math.random() * 0.025 + 0.006) * (Math.random() < 0.5 ? -1 : 1),
            radius: maxOrbit * (1.1 + Math.random() * 0.2),
            size: 1.2 + Math.random() * 1.3,
            tilt: 0.5 + Math.random() * 0.3,
        }));

        this.pulses = Array.from({ length: Math.round(nodeCount * 0.7) }, () =>
            this.spawnPulse()
        );
    }

    spawnPulse() {
        return {
            nodeIndex: Math.floor(Math.random() * this.nodes.length),
            progress: Math.random(),
            speed: 0.13 + Math.random() * 0.22,
            outward: Math.random() < 0.5,
        };
    }

    /** Orbit position with a z-depth so nodes swing toward/away from camera */
    nodePosition3D(node, t) {
        const wobble = Math.sin(t * 0.35 + node.radiusJitterPhase) * (this.coreRadius * 0.12);
        const r = node.radius + wobble;
        const a = node.angle + t * node.angularSpeed;
        return {
            x: this.center.x + Math.cos(a) * r,
            y: this.center.y + Math.sin(a) * r * node.tilt,
            z: Math.sin(a) * (1 - node.tilt),
        };
    }

    depthScale(z) {
        return 1 + z * 0.45;
    }

    drawStars(t) {
        const { ctx } = this;
        const starColor = this.isLight ? this.primaryRgb : [255, 255, 255];
        for (const star of this.stars) {
            const twinkle = 0.4 + 0.35 * Math.sin(t * star.twinkleSpeed + star.twinklePhase);
            ctx.fillStyle = this.rgba(starColor, Math.max(0, twinkle * (this.isLight ? 0.35 : 0.5)));
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /** Pseudo-3D wireframe sphere: a lat/long grid rotated and projected */
    drawCore(t) {
        const { ctx, center, coreRadius } = this;
        const pulse = 1 + Math.sin(t * 1.1) * 0.04;
        const r = coreRadius * pulse;
        const rotY = t * 0.22;
        const rotX = 0.5 + Math.sin(t * 0.15) * 0.15;

        const blendMode = this.isLight ? "source-over" : "lighter";
        ctx.globalCompositeOperation = blendMode;

        // Outer glow
        const glow = ctx.createRadialGradient(center.x, center.y, r * 0.2, center.x, center.y, r * 2.8);
        glow.addColorStop(0, this.rgba(this.primaryRgb, this.isLight ? 0.2 : 0.32));
        glow.addColorStop(1, this.rgba(this.primaryRgb, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(center.x, center.y, r * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Build a lat/long wireframe
        const lats = 6;
        const lons = 10;
        const project = (theta, phi) => {
            let x = Math.sin(phi) * Math.cos(theta);
            let y = Math.cos(phi);
            let z = Math.sin(phi) * Math.sin(theta);
            const y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
            const z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
            y = y1; z = z1;
            const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
            const z2 = -x * Math.sin(rotY) + z * Math.cos(rotY);
            x = x1; z = z2;
            return { x: center.x + x * r, y: center.y + y * r, z };
        };

        ctx.lineWidth = 1;
        // Latitude rings
        for (let i = 1; i < lats; i++) {
            const phi = (i / lats) * Math.PI;
            ctx.beginPath();
            let started = false;
            for (let j = 0; j <= lons; j++) {
                const theta = (j / lons) * Math.PI * 2;
                const p = project(theta, phi);
                const alpha = (this.isLight ? 0.15 : 0.08) + Math.max(0, p.z) * (this.isLight ? 0.35 : 0.28);
                if (j === 0) {
                    ctx.strokeStyle = this.rgba(this.secondaryRgb, alpha);
                }
                if (!started) { ctx.moveTo(p.x, p.y); started = true; }
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }
        // Longitude arcs
        for (let j = 0; j < lons; j++) {
            const theta = (j / lons) * Math.PI * 2;
            ctx.beginPath();
            let started = false;
            let maxZ = -1;
            for (let i = 0; i <= lats; i++) {
                const phi = (i / lats) * Math.PI;
                const p = project(theta, phi);
                maxZ = Math.max(maxZ, p.z);
                if (!started) { ctx.moveTo(p.x, p.y); started = true; }
                else ctx.lineTo(p.x, p.y);
            }
            ctx.strokeStyle = this.rgba(this.secondaryRgb, (this.isLight ? 0.15 : 0.08) + Math.max(0, maxZ) * (this.isLight ? 0.3 : 0.22));
            ctx.stroke();
        }

        // Solid inner core with a hot offset highlight
        const core = ctx.createRadialGradient(
            center.x - r * 0.3, center.y - r * 0.3, r * 0.05,
            center.x, center.y, r
        );
        core.addColorStop(0, this.rgba(this.secondaryRgb, this.isLight ? 0.9 : 0.95));
        core.addColorStop(0.45, this.rgba(this.primaryRgb, this.isLight ? 0.85 : 0.9));
        core.addColorStop(1, this.rgba(this.primaryRgb, this.isLight ? 0.3 : 0.2));
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";

        ctx.strokeStyle = this.rgba(this.secondaryRgb, this.isLight ? 0.7 : 0.55);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        ctx.stroke();

        // Slow HUD-style tick ring
        const tickCount = 24;
        for (let i = 0; i < tickCount; i++) {
            const a = (i / tickCount) * Math.PI * 2 + t * 0.15;
            const active = i % 3 === 0;
            const innerR = r * 1.18;
            const outerR = innerR + (active ? 7 : 3);
            const x1 = center.x + Math.cos(a) * innerR;
            const y1 = center.y + Math.sin(a) * innerR;
            const x2 = center.x + Math.cos(a) * outerR;
            const y2 = center.y + Math.sin(a) * outerR;
            ctx.strokeStyle = this.rgba(this.secondaryRgb, active ? (this.isLight ? 0.5 : 0.35) : (this.isLight ? 0.25 : 0.15));
            ctx.lineWidth = active ? 1.4 : 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    drawConnections(t) {
        const { ctx, center } = this;
        for (const node of this.nodes) {
            const pos = this.nodePosition3D(node, t);
            const color = this.clusterColor(node.clusterId);
            ctx.strokeStyle = this.rgba(color, (this.isLight ? 0.12 : 0.06) + Math.max(0, pos.z) * 0.08);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            const midX = (center.x + pos.x) / 2 + Math.sin(t * 0.3 + node.pulsePhase) * 12;
            const midY = (center.y + pos.y) / 2 + Math.cos(t * 0.3 + node.pulsePhase) * 12;
            ctx.quadraticCurveTo(midX, midY, pos.x, pos.y);
            ctx.stroke();
        }

        for (let c = 0; c < this.clusterCount; c++) {
            const clusterNodes = this.nodes.filter((n) => n.clusterId === c);
            const color = this.clusterColor(c);
            for (let i = 0; i < clusterNodes.length - 1; i++) {
                const a = this.nodePosition3D(clusterNodes[i], t);
                const b = this.nodePosition3D(clusterNodes[i + 1], t);
                ctx.strokeStyle = this.rgba(color, this.isLight ? 0.1 : 0.05);
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }

    drawNodes(t) {
        const { ctx } = this;
        const ordered = [...this.nodes]
            .map((n) => ({ n, pos: this.nodePosition3D(n, t) }))
            .sort((a, b) => a.pos.z - b.pos.z);

        const blendMode = this.isLight ? "source-over" : "lighter";
        ctx.globalCompositeOperation = blendMode;
        for (const { n, pos } of ordered) {
            const depth = this.depthScale(pos.z);
            const glowPulse = 0.5 + 0.5 * Math.sin(t * 1.6 + n.pulsePhase);
            const color = this.clusterColor(n.clusterId);
            const size = n.size * depth;

            ctx.fillStyle = this.rgba(color, (this.isLight ? 0.22 : 0.12 + glowPulse * 0.12) * depth);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size * (2.4 + glowPulse), 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = this.rgba(color, Math.min(1, (this.isLight ? 0.85 : 0.7) * depth + 0.15));
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
    }

    drawPulses(t, dtSeconds) {
        const { ctx, center } = this;
        const blendMode = this.isLight ? "source-over" : "lighter";
        ctx.globalCompositeOperation = blendMode;
        const trailSteps = 5;
        for (const pulse of this.pulses) {
            const node = this.nodes[pulse.nodeIndex];
            if (!node) continue;
            const targetPos = this.nodePosition3D(node, t);
            const from = pulse.outward ? { x: center.x, y: center.y } : targetPos;
            const to = pulse.outward ? targetPos : { x: center.x, y: center.y };

            pulse.progress += dtSeconds * pulse.speed;
            if (pulse.progress >= 1) {
                Object.assign(pulse, this.spawnPulse());
                continue;
            }

            const color = this.clusterColor(node.clusterId);
            const fade = Math.sin(Math.min(1, pulse.progress) * Math.PI);

            for (let s = trailSteps; s >= 0; s--) {
                const trailProgress = pulse.progress - s * 0.015;
                if (trailProgress < 0) continue;
                const x = from.x + (to.x - from.x) * trailProgress;
                const y = from.y + (to.y - from.y) * trailProgress;
                const trailFade = fade * (1 - s / (trailSteps + 1));
                ctx.fillStyle = this.rgba(color, (this.isLight ? 0.95 : 0.85) * trailFade);
                ctx.beginPath();
                ctx.arc(x, y, Math.max(0.4, 2.2 - s * 0.3), 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalCompositeOperation = "source-over";
    }

    drawSatellites(t) {
        const { ctx, center } = this;
        ctx.strokeStyle = this.rgba(this.secondaryRgb, this.isLight ? 0.1 : 0.05);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(center.x, center.y, this.satellites[0]?.radius ?? 0, 0, Math.PI * 2);
        ctx.stroke();

        const blendMode = this.isLight ? "source-over" : "lighter";
        ctx.globalCompositeOperation = blendMode;
        for (const sat of this.satellites) {
            const a = sat.angle + t * sat.angularSpeed;
            const z = Math.sin(a) * (1 - sat.tilt);
            const depth = this.depthScale(z);
            const x = center.x + Math.cos(a) * sat.radius;
            const y = center.y + Math.sin(a) * sat.radius * sat.tilt;
            ctx.fillStyle = this.rgba(this.secondaryRgb, (this.isLight ? 0.6 : 0.45) * depth);
            ctx.beginPath();
            ctx.arc(x, y, sat.size * depth, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
    }

    drawVignette() {
        const { ctx, width, height } = this;
        const grad = ctx.createRadialGradient(
            width / 2, height / 2, Math.min(width, height) * 0.35,
            width / 2, height / 2, Math.max(width, height) * 0.75
        );
        const vignetteAlpha = this.isLight ? 0.08 : 0.35;
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, `rgba(0,0,0,${vignetteAlpha})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
    }

    colorCheckCounter = 0;

    frame = (now) => {
        const t = (now - this.startTime) / 1000;
        const dtSeconds = Math.min((now - this.lastFrameTime) / 1000, 0.05);
        this.lastFrameTime = now;

        this.colorCheckCounter++;
        if (this.colorCheckCounter % 20 === 0) {
            this.readThemeColors();
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawStars(t);
        this.drawConnections(t);
        this.drawSatellites(t);
        this.drawPulses(t, dtSeconds);
        this.drawNodes(t);
        this.drawCore(t);
        this.drawVignette();

        if (!this.prefersReducedMotion) {
            this.rafId = requestAnimationFrame(this.frame);
        }
    };

    start() {
        this.lastFrameTime = performance.now();
        this.startTime = performance.now();
        if (this.prefersReducedMotion) {
            this.frame(performance.now());
            return;
        }
        this.rafId = requestAnimationFrame(this.frame);
    }

    stop() {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    destroy() {
        this.stop();
    }
}

/* ------------------------------------------------------------------ */
/* React wrapper                                                      */
/* ------------------------------------------------------------------ */

export default function PunkRecordsCoreCanvas({ className = "" }) {
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const { themeMode, themePreset } = useThemeStore();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new PunkRecordsCoreRenderer(canvas);
        rendererRef.current = renderer;
        renderer.start();

        const handleResize = () => {
            renderer.resize();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            renderer.destroy();
            rendererRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (rendererRef.current) {
            rendererRef.current.readThemeColors();
        }
    }, [themeMode, themePreset]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
            aria-hidden="true"
        />
    );
}
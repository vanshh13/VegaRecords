(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/theme/AnimatedBackground.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AnimatedBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme.store.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function AnimatedBackground() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { backgroundType, backgroundImage, backgroundVideo, themePreset, motionPreset, iconShape, themeMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimatedBackground.useEffect": ()=>{
            if (backgroundType !== "animated") return;
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            let animationFrameId;
            let width = canvas.width = window.innerWidth;
            let height = canvas.height = window.innerHeight;
            // Mouse tracking for dynamic interactive physics
            const mouse = {
                x: width / 2,
                y: height / 2
            };
            const handleResize = {
                "AnimatedBackground.useEffect.handleResize": ()=>{
                    if (!canvas) return;
                    width = canvas.width = window.innerWidth;
                    height = canvas.height = window.innerHeight;
                }
            }["AnimatedBackground.useEffect.handleResize"];
            const handleMouseMove = {
                "AnimatedBackground.useEffect.handleMouseMove": (e)=>{
                    mouse.x = e.clientX;
                    mouse.y = e.clientY;
                }
            }["AnimatedBackground.useEffect.handleMouseMove"];
            window.addEventListener("resize", handleResize);
            window.addEventListener("mousemove", handleMouseMove);
            const preset = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRESETS"][themePreset] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRESETS"].default;
            const isLight = themeMode === "light";
            const modeColors = preset[themeMode] || preset;
            const primaryColor = modeColors.primary || preset.primary;
            const secondaryColor = modeColors.secondary || preset.secondary;
            // --- 1. Star / Icon Dust Particles ---
            const codeSymbols = [
                "</>",
                "{}",
                "=>",
                "01",
                "⚡",
                "✨",
                "VEGA"
            ];
            const particles = Array.from({
                length: 55
            }, {
                "AnimatedBackground.useEffect.particles": ()=>({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        radius: Math.random() * 2.5 + 1.5,
                        speedX: (Math.random() - 0.5) * 0.6,
                        speedY: (Math.random() - 0.5) * 0.6,
                        alpha: Math.random() * 0.6 + 0.3,
                        symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)]
                    })
            }["AnimatedBackground.useEffect.particles"]);
            // --- 2. Matrix Code Rain ---
            const matrixChars = "01VEGARECORDS101";
            const fontSize = 14;
            const columns = Math.max(10, Math.floor(width / fontSize));
            const drops = Array.from({
                length: columns
            }, {
                "AnimatedBackground.useEffect.drops": ()=>Math.floor(Math.random() * -80)
            }["AnimatedBackground.useEffect.drops"]);
            // --- 3. Neon Cyber Rain Streaks ---
            const rainDrops = Array.from({
                length: 60
            }, {
                "AnimatedBackground.useEffect.rainDrops": ()=>({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        length: Math.random() * 25 + 10,
                        speed: Math.random() * 8 + 4,
                        opacity: Math.random() * 0.5 + 0.2
                    })
            }["AnimatedBackground.useEffect.rainDrops"]);
            // --- 4. Ambient Cosmic Snow ---
            const snowFlakes = Array.from({
                length: 55
            }, {
                "AnimatedBackground.useEffect.snowFlakes": ()=>({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        radius: Math.random() * 3 + 1,
                        speedY: Math.random() * 1.2 + 0.4,
                        swing: Math.random() * 0.02,
                        step: Math.random() * Math.PI * 2
                    })
            }["AnimatedBackground.useEffect.snowFlakes"]);
            // --- 5. High-Fidelity Cosmic Plasma Orbs ---
            const plasmaOrbs = Array.from({
                length: 6
            }, {
                "AnimatedBackground.useEffect.plasmaOrbs": (_, i)=>({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        baseRadius: Math.random() * 180 + 140,
                        radius: Math.random() * 180 + 140,
                        vx: (Math.random() - 0.5) * 0.7,
                        vy: (Math.random() - 0.5) * 0.7,
                        pulseSpeed: Math.random() * 0.02 + 0.01,
                        pulseAngle: Math.random() * Math.PI * 2,
                        color: i % 2 === 0 ? primaryColor : secondaryColor
                    })
            }["AnimatedBackground.useEffect.plasmaOrbs"]);
            // Embedded Stardust for Cosmic Plasma
            const cosmicStardust = Array.from({
                length: 40
            }, {
                "AnimatedBackground.useEffect.cosmicStardust": ()=>({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        radius: Math.random() * 2 + 0.8,
                        alpha: Math.random() * 0.7 + 0.2,
                        vx: (Math.random() - 0.5) * 0.4,
                        vy: (Math.random() - 0.5) * 0.4
                    })
            }["AnimatedBackground.useEffect.cosmicStardust"]);
            // --- 6. Fluid Motion Wave Parameters ---
            let waveTime = 0;
            // Canvas Render loop
            const render = {
                "AnimatedBackground.useEffect.render": ()=>{
                    ctx.clearRect(0, 0, width, height);
                    if (motionPreset === "matrix") {
                        ctx.fillStyle = isLight ? "rgba(241, 245, 249, 0.2)" : "rgba(9, 13, 22, 0.2)";
                        ctx.fillRect(0, 0, width, height);
                        ctx.fillStyle = primaryColor;
                        ctx.font = `${fontSize}px monospace`;
                        drops.forEach({
                            "AnimatedBackground.useEffect.render": (y, i)=>{
                                const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                                const x = i * fontSize;
                                ctx.fillText(char, x, y * fontSize);
                                if (y * fontSize > height && Math.random() > 0.975) {
                                    drops[i] = 0;
                                }
                                drops[i]++;
                            }
                        }["AnimatedBackground.useEffect.render"]);
                    } else if (motionPreset === "cyber-grid") {
                        waveTime = (waveTime + 0.5) % 40;
                        ctx.strokeStyle = primaryColor;
                        ctx.globalAlpha = isLight ? 0.08 : 0.18;
                        ctx.lineWidth = 1;
                        for(let x = 0; x <= width; x += 40){
                            ctx.beginPath();
                            ctx.moveTo(x, 0);
                            ctx.lineTo(x, height);
                            ctx.stroke();
                        }
                        for(let y = waveTime; y <= height; y += 40){
                            ctx.beginPath();
                            ctx.moveTo(0, y);
                            ctx.lineTo(width, y);
                            ctx.stroke();
                        }
                        ctx.globalAlpha = 1;
                    } else if (motionPreset === "nebula") {
                        // --- COSMIC PLASMA ORBS RENDER ---
                        ctx.save();
                        if (!isLight) {
                            ctx.globalCompositeOperation = "screen";
                        }
                        plasmaOrbs.forEach({
                            "AnimatedBackground.useEffect.render": (orb)=>{
                                // Dynamic Orbit & Radius Pulse
                                orb.pulseAngle += orb.pulseSpeed;
                                orb.radius = orb.baseRadius + Math.sin(orb.pulseAngle) * 35;
                                // Gentle Mouse Gravity Drift
                                const dx = mouse.x - orb.x;
                                const dy = mouse.y - orb.y;
                                orb.x += orb.vx + dx * 0.0003;
                                orb.y += orb.vy + dy * 0.0003;
                                if (orb.x < -150) orb.x = width + 150;
                                if (orb.x > width + 150) orb.x = -150;
                                if (orb.y < -150) orb.y = height + 150;
                                if (orb.y > height + 150) orb.y = -150;
                                const grad = ctx.createRadialGradient(orb.x, orb.y, orb.radius * 0.05, orb.x, orb.y, orb.radius);
                                grad.addColorStop(0, orb.color);
                                grad.addColorStop(0.5, `${orb.color}60`);
                                grad.addColorStop(1, "transparent");
                                ctx.globalAlpha = isLight ? 0.15 : 0.28;
                                ctx.fillStyle = grad;
                                ctx.beginPath();
                                ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        }["AnimatedBackground.useEffect.render"]);
                        ctx.restore();
                        // Render embedded cosmic stardust
                        cosmicStardust.forEach({
                            "AnimatedBackground.useEffect.render": (p)=>{
                                p.x += p.vx;
                                p.y += p.vy;
                                if (p.x < 0) p.x = width;
                                if (p.x > width) p.x = 0;
                                if (p.y < 0) p.y = height;
                                if (p.y > height) p.y = 0;
                                ctx.save();
                                ctx.globalAlpha = isLight ? p.alpha * 0.5 : p.alpha;
                                ctx.fillStyle = primaryColor;
                                ctx.shadowBlur = 10;
                                ctx.shadowColor = primaryColor;
                                ctx.beginPath();
                                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.restore();
                            }
                        }["AnimatedBackground.useEffect.render"]);
                    } else if (motionPreset === "rain") {
                        rainDrops.forEach({
                            "AnimatedBackground.useEffect.render": (d)=>{
                                d.y += d.speed;
                                if (d.y > height) {
                                    d.y = -d.length;
                                    d.x = Math.random() * width;
                                }
                                ctx.save();
                                ctx.strokeStyle = primaryColor;
                                ctx.globalAlpha = isLight ? d.opacity * 0.6 : d.opacity;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(d.x, d.y);
                                ctx.lineTo(d.x, d.y + d.length);
                                ctx.stroke();
                                ctx.restore();
                            }
                        }["AnimatedBackground.useEffect.render"]);
                    } else if (motionPreset === "snow") {
                        snowFlakes.forEach({
                            "AnimatedBackground.useEffect.render": (s)=>{
                                s.step += s.swing;
                                s.x += Math.sin(s.step) * 0.5;
                                s.y += s.speedY;
                                if (s.y > height) {
                                    s.y = -10;
                                    s.x = Math.random() * width;
                                }
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                                ctx.fillStyle = isLight ? primaryColor : "#ffffff";
                                ctx.globalAlpha = 0.4;
                                ctx.fill();
                                ctx.restore();
                            }
                        }["AnimatedBackground.useEffect.render"]);
                    } else if (motionPreset === "gradient") {
                        // --- FLUID MOTION WAVE RENDER ---
                        waveTime += 0.012;
                        ctx.save();
                        ctx.globalAlpha = isLight ? 0.12 : 0.25;
                        // Wave Layer 1 (Primary Fluid Blob)
                        const x1 = width * 0.35 + Math.cos(waveTime * 0.7) * (width * 0.2);
                        const y1 = height * 0.4 + Math.sin(waveTime * 0.9) * (height * 0.2);
                        const grad1 = ctx.createRadialGradient(x1, y1, 80, x1, y1, width * 0.6);
                        grad1.addColorStop(0, primaryColor);
                        grad1.addColorStop(0.6, `${secondaryColor}80`);
                        grad1.addColorStop(1, "transparent");
                        ctx.fillStyle = grad1;
                        ctx.fillRect(0, 0, width, height);
                        // Wave Layer 2 (Secondary Fluid Wave Counter-pulse)
                        const x2 = width * 0.7 - Math.sin(waveTime * 0.8) * (width * 0.25);
                        const y2 = height * 0.6 + Math.cos(waveTime * 0.6) * (height * 0.25);
                        const grad2 = ctx.createRadialGradient(x2, y2, 60, x2, y2, width * 0.5);
                        grad2.addColorStop(0, secondaryColor);
                        grad2.addColorStop(0.7, `${primaryColor}60`);
                        grad2.addColorStop(1, "transparent");
                        ctx.fillStyle = grad2;
                        ctx.fillRect(0, 0, width, height);
                        // Wave Layer 3 (Sine Wave Ribbon along center)
                        ctx.beginPath();
                        ctx.moveTo(0, height * 0.5);
                        for(let x = 0; x <= width; x += 30){
                            const y = height * 0.5 + Math.sin(x * 0.004 + waveTime) * 60 + Math.cos(x * 0.002 - waveTime * 0.5) * 40;
                            ctx.lineTo(x, y);
                        }
                        ctx.lineTo(width, height);
                        ctx.lineTo(0, height);
                        ctx.closePath();
                        const waveGrad = ctx.createLinearGradient(0, 0, width, height);
                        waveGrad.addColorStop(0, `${primaryColor}40`);
                        waveGrad.addColorStop(1, `${secondaryColor}40`);
                        ctx.fillStyle = waveGrad;
                        ctx.fill();
                        ctx.restore();
                    } else {
                        // Default Star & Custom Icon Particles
                        particles.forEach({
                            "AnimatedBackground.useEffect.render": (p)=>{
                                p.x += p.speedX;
                                p.y += p.speedY;
                                if (p.x < 0) p.x = width;
                                if (p.x > width) p.x = 0;
                                if (p.y < 0) p.y = height;
                                if (p.y > height) p.y = 0;
                                ctx.save();
                                ctx.globalAlpha = p.alpha;
                                ctx.fillStyle = primaryColor;
                                if (iconShape === "code") {
                                    ctx.font = "12px monospace";
                                    ctx.fillText(p.symbol, p.x, p.y);
                                } else if (iconShape === "star") {
                                    ctx.font = "12px sans-serif";
                                    ctx.fillText("★", p.x, p.y);
                                } else if (iconShape === "spark") {
                                    ctx.font = "12px sans-serif";
                                    ctx.fillText("⚡", p.x, p.y);
                                } else {
                                    // Default Circle Glowing Orb
                                    ctx.beginPath();
                                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                                    ctx.shadowBlur = 8;
                                    ctx.shadowColor = primaryColor;
                                    ctx.fill();
                                }
                                ctx.restore();
                            }
                        }["AnimatedBackground.useEffect.render"]);
                    }
                    animationFrameId = requestAnimationFrame(render);
                }
            }["AnimatedBackground.useEffect.render"];
            render();
            return ({
                "AnimatedBackground.useEffect": ()=>{
                    cancelAnimationFrame(animationFrameId);
                    window.removeEventListener("resize", handleResize);
                    window.removeEventListener("mousemove", handleMouseMove);
                }
            })["AnimatedBackground.useEffect"];
        }
    }["AnimatedBackground.useEffect"], [
        backgroundType,
        themePreset,
        motionPreset,
        iconShape,
        themeMode
    ]);
    if (backgroundType === "image" && backgroundImage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-0 bg-cover bg-center transition-all duration-700 pointer-events-none opacity-40",
            style: {
                backgroundImage: `url(${backgroundImage})`
            }
        }, void 0, false, {
            fileName: "[project]/src/components/theme/AnimatedBackground.jsx",
            lineNumber: 349,
            columnNumber: 7
        }, this);
    }
    if (backgroundType === "video" && backgroundVideo) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
            autoPlay: true,
            loop: true,
            muted: true,
            playsInline: true,
            className: "fixed inset-0 z-0 w-full h-full object-cover transition-all duration-700 pointer-events-none opacity-30",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                src: backgroundVideo,
                type: "video/mp4"
            }, void 0, false, {
                fileName: "[project]/src/components/theme/AnimatedBackground.jsx",
                lineNumber: 365,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/theme/AnimatedBackground.jsx",
            lineNumber: 358,
            columnNumber: 7
        }, this);
    }
    if (backgroundType === "animated") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
            ref: canvasRef,
            className: "fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 opacity-70"
        }, void 0, false, {
            fileName: "[project]/src/components/theme/AnimatedBackground.jsx",
            lineNumber: 372,
            columnNumber: 7
        }, this);
    }
    return null;
}
_s(AnimatedBackground, "hDoBjz1EbQjOgJIWEosNVkrgE4s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"]
    ];
});
_c = AnimatedBackground;
var _c;
__turbopack_context__.k.register(_c, "AnimatedBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/theme/ThemeProvider.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme.store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2f$AnimatedBackground$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/theme/AnimatedBackground.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ThemeProvider({ children }) {
    _s();
    const { themeMode, themePreset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            setMounted(true);
        }
    }["ThemeProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            const root = document.documentElement;
            const isLight = themeMode === "light";
            const preset = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRESETS"][themePreset] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRESETS"].default;
            const colors = preset[themeMode] || (isLight ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRESETS"].default.light : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRESETS"].default.dark);
            if (isLight) {
                root.classList.remove("dark");
                root.classList.add("light");
            } else {
                root.classList.remove("light");
                root.classList.add("dark");
            }
            root.style.setProperty("--primary", colors.primary);
            root.style.setProperty("--secondary", colors.secondary);
            root.style.setProperty("--background", colors.background);
            root.style.setProperty("--surface", colors.surface);
            root.style.setProperty("--card", colors.card);
            root.style.setProperty("--card-hover", colors.cardHover || colors.card);
            root.style.setProperty("--text", colors.text);
            root.style.setProperty("--text-muted", colors.textMuted);
            root.style.setProperty("--border", colors.border);
            root.style.setProperty("--hover-bg", colors.hoverBg);
        }
    }["ThemeProvider.useEffect"], [
        themeMode,
        themePreset
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2f$AnimatedBackground$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/theme/ThemeProvider.jsx",
                lineNumber: 43,
                columnNumber: 19
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/theme/ThemeProvider.jsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(ThemeProvider, "TYw51WktIOZ5hguQPo/wqiOs8jw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"]
    ];
});
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/providers/QueryProvider.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function QueryProvider({ children }) {
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "QueryProvider.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: 1,
                        staleTime: 1000 * 60 * 5
                    }
                }
            })
    }["QueryProvider.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/providers/QueryProvider.jsx",
        lineNumber: 20,
        columnNumber: 10
    }, this);
}
_s(QueryProvider, "lkEUjem27n7xJ9KnGmAPt5bp7mw=");
_c = QueryProvider;
var _c;
__turbopack_context__.k.register(_c, "QueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/theme.store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ICON_SHAPES",
    ()=>ICON_SHAPES,
    "MOTION_PRESETS",
    ()=>MOTION_PRESETS,
    "PRESETS",
    ()=>PRESETS,
    "useThemeStore",
    ()=>useThemeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const PRESETS = {
    default: {
        name: "Default Neo",
        primary: "#6366f1",
        secondary: "#a855f7",
        background: "#090d16",
        surface: "#111827",
        card: "rgba(17, 24, 39, 0.75)",
        cardHover: "rgba(31, 41, 55, 0.85)",
        text: "#f9fafb",
        textMuted: "#9ca3af",
        border: "rgba(255, 255, 255, 0.1)",
        hoverBg: "rgba(255, 255, 255, 0.08)",
        dark: {
            primary: "#6366f1",
            secondary: "#a855f7",
            background: "#090d16",
            surface: "#111827",
            card: "rgba(17, 24, 39, 0.75)",
            cardHover: "rgba(31, 41, 55, 0.85)",
            text: "#f9fafb",
            textMuted: "#9ca3af",
            border: "rgba(255, 255, 255, 0.1)",
            hoverBg: "rgba(255, 255, 255, 0.08)"
        },
        light: {
            primary: "#4f46e5",
            secondary: "#7c3aed",
            background: "#f8fafc",
            surface: "#ffffff",
            card: "#ffffff",
            cardHover: "#f1f5f9",
            text: "#0f172a",
            textMuted: "#64748b",
            border: "rgba(0, 0, 0, 0.1)",
            hoverBg: "rgba(0, 0, 0, 0.05)"
        }
    },
    cyberpunk: {
        name: "Cyberpunk Neon",
        primary: "#f43f5e",
        secondary: "#06b6d4",
        background: "#080612",
        surface: "#120e24",
        card: "rgba(18, 14, 36, 0.8)",
        cardHover: "rgba(30, 24, 58, 0.9)",
        text: "#f8fafc",
        textMuted: "#a5b4fc",
        border: "rgba(244, 63, 94, 0.3)",
        hoverBg: "rgba(244, 63, 94, 0.15)",
        dark: {
            primary: "#f43f5e",
            secondary: "#06b6d4",
            background: "#080612",
            surface: "#120e24",
            card: "rgba(18, 14, 36, 0.8)",
            cardHover: "rgba(30, 24, 58, 0.9)",
            text: "#f8fafc",
            textMuted: "#a5b4fc",
            border: "rgba(244, 63, 94, 0.3)",
            hoverBg: "rgba(244, 63, 94, 0.15)"
        },
        light: {
            primary: "#e11d48",
            secondary: "#0891b2",
            background: "#fff1f2",
            surface: "#ffffff",
            card: "#ffffff",
            cardHover: "#ffe4e6",
            text: "#1e1b4b",
            textMuted: "#64748b",
            border: "rgba(225, 29, 72, 0.2)",
            hoverBg: "rgba(225, 29, 72, 0.08)"
        }
    },
    ocean: {
        name: "Oceanic Deep",
        primary: "#0ea5e9",
        secondary: "#14b8a6",
        background: "#031326",
        surface: "#072240",
        card: "rgba(7, 34, 64, 0.8)",
        cardHover: "rgba(12, 45, 84, 0.9)",
        text: "#f0f9ff",
        textMuted: "#7dd3fc",
        border: "rgba(14, 165, 233, 0.25)",
        hoverBg: "rgba(14, 165, 233, 0.12)",
        dark: {
            primary: "#0ea5e9",
            secondary: "#14b8a6",
            background: "#031326",
            surface: "#072240",
            card: "rgba(7, 34, 64, 0.8)",
            cardHover: "rgba(12, 45, 84, 0.9)",
            text: "#f0f9ff",
            textMuted: "#7dd3fc",
            border: "rgba(14, 165, 233, 0.25)",
            hoverBg: "rgba(14, 165, 233, 0.12)"
        },
        light: {
            primary: "#0284c7",
            secondary: "#0d9488",
            background: "#f0f9ff",
            surface: "#ffffff",
            card: "#ffffff",
            cardHover: "#e0f2fe",
            text: "#0c4a6e",
            textMuted: "#0369a1",
            border: "rgba(2, 132, 199, 0.2)",
            hoverBg: "rgba(2, 132, 199, 0.08)"
        }
    },
    galaxy: {
        name: "Cosmic Galaxy",
        primary: "#8b5cf6",
        secondary: "#ec4899",
        background: "#0b0518",
        surface: "#170c31",
        card: "rgba(23, 12, 49, 0.8)",
        cardHover: "rgba(35, 18, 74, 0.9)",
        text: "#faf5ff",
        textMuted: "#c084fc",
        border: "rgba(139, 92, 246, 0.3)",
        hoverBg: "rgba(139, 92, 246, 0.15)",
        dark: {
            primary: "#8b5cf6",
            secondary: "#ec4899",
            background: "#0b0518",
            surface: "#170c31",
            card: "rgba(23, 12, 49, 0.8)",
            cardHover: "rgba(35, 18, 74, 0.9)",
            text: "#faf5ff",
            textMuted: "#c084fc",
            border: "rgba(139, 92, 246, 0.3)",
            hoverBg: "rgba(139, 92, 246, 0.15)"
        },
        light: {
            primary: "#7c3aed",
            secondary: "#db2777",
            background: "#faf5ff",
            surface: "#ffffff",
            card: "#ffffff",
            cardHover: "#f3e8ff",
            text: "#3b0764",
            textMuted: "#6b21a8",
            border: "rgba(124, 58, 237, 0.2)",
            hoverBg: "rgba(124, 58, 237, 0.08)"
        }
    },
    matrix: {
        name: "Matrix Code",
        primary: "#22c55e",
        secondary: "#10b981",
        background: "#020a05",
        surface: "#081c0f",
        card: "rgba(8, 28, 15, 0.85)",
        cardHover: "rgba(12, 42, 23, 0.95)",
        text: "#f0fdf4",
        textMuted: "#86efac",
        border: "rgba(34, 197, 94, 0.3)",
        hoverBg: "rgba(34, 197, 94, 0.15)",
        dark: {
            primary: "#22c55e",
            secondary: "#10b981",
            background: "#020a05",
            surface: "#081c0f",
            card: "rgba(8, 28, 15, 0.85)",
            cardHover: "rgba(12, 42, 23, 0.95)",
            text: "#f0fdf4",
            textMuted: "#86efac",
            border: "rgba(34, 197, 94, 0.3)",
            hoverBg: "rgba(34, 197, 94, 0.15)"
        },
        light: {
            primary: "#16a34a",
            secondary: "#059669",
            background: "#f0fdf4",
            surface: "#ffffff",
            card: "#ffffff",
            cardHover: "#dcfce7",
            text: "#052e16",
            textMuted: "#15803d",
            border: "rgba(22, 163, 74, 0.2)",
            hoverBg: "rgba(22, 163, 74, 0.08)"
        }
    },
    minimal: {
        name: "Minimal Clean",
        primary: "#64748b",
        secondary: "#475569",
        background: "#0f172a",
        surface: "#1e293b",
        card: "rgba(30, 41, 59, 0.8)",
        cardHover: "rgba(47, 63, 86, 0.9)",
        text: "#f8fafc",
        textMuted: "#94a3b8",
        border: "rgba(255, 255, 255, 0.12)",
        hoverBg: "rgba(255, 255, 255, 0.08)",
        dark: {
            primary: "#64748b",
            secondary: "#475569",
            background: "#0f172a",
            surface: "#1e293b",
            card: "rgba(30, 41, 59, 0.8)",
            cardHover: "rgba(47, 63, 86, 0.9)",
            text: "#f8fafc",
            textMuted: "#94a3b8",
            border: "rgba(255, 255, 255, 0.12)",
            hoverBg: "rgba(255, 255, 255, 0.08)"
        },
        light: {
            primary: "#475569",
            secondary: "#334155",
            background: "#f8fafc",
            surface: "#ffffff",
            card: "#ffffff",
            cardHover: "#f1f5f9",
            text: "#0f172a",
            textMuted: "#64748b",
            border: "rgba(71, 85, 105, 0.2)",
            hoverBg: "rgba(71, 85, 105, 0.08)"
        }
    }
};
const MOTION_PRESETS = [
    {
        id: "particles",
        name: "Star Dust Particles",
        description: "Floating glowing constellation nodes"
    },
    {
        id: "matrix",
        name: "Digital Matrix Rain",
        description: "Falling binary cyber code streams"
    },
    {
        id: "cyber-grid",
        name: "3D Synthwave Grid",
        description: "Futuristic perspective grid plane"
    },
    {
        id: "nebula",
        name: "Cosmic Plasma Orbs",
        description: "Swirling ambient plasma nebula"
    },
    {
        id: "rain",
        name: "Neon Cyber Rain",
        description: "Vertical high-speed rain streaks"
    },
    {
        id: "snow",
        name: "Ambient Cosmic Snow",
        description: "Drifting gentle snowflakes"
    },
    {
        id: "gradient",
        name: "Fluid Motion Wave",
        description: "Dynamic pulsing color mesh waves"
    }
];
const ICON_SHAPES = [
    {
        id: "circle",
        name: "Glowing Orbs"
    },
    {
        id: "star",
        name: "Floating Stars ✨"
    },
    {
        id: "code",
        name: "Code Symbols </>"
    },
    {
        id: "spark",
        name: "Neon Sparks ⚡"
    }
];
const useThemeStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        themeMode: "dark",
        themePreset: "default",
        backgroundType: "animated",
        motionPreset: "particles",
        iconShape: "circle",
        backgroundImage: "",
        backgroundVideo: "",
        setThemeMode: (mode)=>set({
                themeMode: mode
            }),
        setThemePreset: (preset)=>set({
                themePreset: preset
            }),
        setBackgroundType: (type)=>set({
                backgroundType: type
            }),
        setMotionPreset: (motion)=>set({
                motionPreset: motion
            }),
        setIconShape: (shape)=>set({
                iconShape: shape
            }),
        setBackgroundImage: (url)=>set({
                backgroundImage: url
            }),
        setBackgroundVideo: (url)=>set({
                backgroundVideo: url
            }),
        resetTheme: ()=>set({
                themeMode: "dark",
                themePreset: "default",
                backgroundType: "animated",
                motionPreset: "particles",
                iconShape: "circle",
                backgroundImage: "",
                backgroundVideo: ""
            })
    }), {
    name: "vegarecords-theme",
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage)
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0yu4a0h._.js.map
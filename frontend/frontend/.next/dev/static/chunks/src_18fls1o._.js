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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2f$renderers$2f$PunkRecordsCore$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/theme/renderers/PunkRecordsCore.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function AnimatedBackground() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { backgroundType, backgroundImage, backgroundVideo, themePreset, motionPreset, iconShape, themeMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimatedBackground.useEffect": ()=>{
            if (backgroundType !== "animated" || motionPreset === "punk-records-core") return;
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
            className: "fixed inset-0 z-0 bg-cover bg-center transition-all duration-700 pointer-events-none opacity-50",
            style: {
                backgroundImage: `url(${backgroundImage})`
            }
        }, void 0, false, {
            fileName: "[project]/src/components/theme/AnimatedBackground.jsx",
            lineNumber: 350,
            columnNumber: 7
        }, this);
    }
    if (backgroundType === "video" && backgroundVideo) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
            autoPlay: true,
            loop: true,
            muted: true,
            playsInline: true,
            className: "fixed inset-0 z-0 w-full h-full object-cover transition-all duration-700 pointer-events-none opacity-40",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                src: backgroundVideo,
                type: "video/mp4"
            }, void 0, false, {
                fileName: "[project]/src/components/theme/AnimatedBackground.jsx",
                lineNumber: 366,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/theme/AnimatedBackground.jsx",
            lineNumber: 359,
            columnNumber: 7
        }, this);
    }
    if (backgroundType === "animated") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-0 pointer-events-none opacity-85",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2f$renderers$2f$PunkRecordsCore$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/theme/AnimatedBackground.jsx",
                    lineNumber: 375,
                    columnNumber: 9
                }, this),
                motionPreset !== "punk-records-core" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                    ref: canvasRef,
                    className: "absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-700"
                }, void 0, false, {
                    fileName: "[project]/src/components/theme/AnimatedBackground.jsx",
                    lineNumber: 379,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/theme/AnimatedBackground.jsx",
            lineNumber: 373,
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
"[project]/src/components/theme/renderers/PunkRecordsCore.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PunkRecordsCoreRenderer",
    ()=>PunkRecordsCoreRenderer,
    "default",
    ()=>PunkRecordsCoreCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme.store.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
class PunkRecordsCoreRenderer {
    canvas = null;
    ctx = null;
    dpr = 1;
    width = 0;
    height = 0;
    center = {
        x: 0,
        y: 0
    };
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
    primaryRgb = [
        124,
        92,
        255
    ];
    secondaryRgb = [
        34,
        211,
        238
    ];
    isLight = false;
    constructor(canvas){
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("PunkRecordsCore: 2D context unavailable");
        this.ctx = ctx;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.prefersReducedMotion = ("TURBOPACK compile-time value", "object") !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        this.readThemeColors();
        this.resize();
        this.seed();
    }
    readThemeColors() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
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
        if (!colorStr) return [
            124,
            92,
            255
        ];
        let str = colorStr.trim();
        if (str.startsWith("rgb")) {
            const matches = str.match(/\d+/g);
            if (matches && matches.length >= 3) {
                return [
                    parseInt(matches[0]),
                    parseInt(matches[1]),
                    parseInt(matches[2])
                ];
            }
        }
        let h = str.replace("#", "");
        if (h.length === 3) h = h.split("").map((c)=>c + c).join("");
        const int = parseInt(h, 16);
        if (Number.isNaN(int)) return [
            124,
            92,
            255
        ];
        return [
            int >> 16 & 255,
            int >> 8 & 255,
            int & 255
        ];
    }
    rgba([r, g, b], a) {
        return `rgba(${r},${g},${b},${a})`;
    }
    /** Linear interpolation between primary and secondary, for cluster hues */ clusterColor(clusterId) {
        const frac = clusterId / Math.max(1, this.clusterCount - 1);
        const [pr, pg, pb] = this.primaryRgb;
        const [sr, sg, sb] = this.secondaryRgb;
        return [
            Math.round(pr + (sr - pr) * frac),
            Math.round(pg + (sg - pg) * frac),
            Math.round(pb + (sb - pb) * frac)
        ];
    }
    resize = ()=>{
        const rect = this.canvas.parentElement?.getBoundingClientRect() ?? {
            width: ("TURBOPACK compile-time truthy", 1) ? window.innerWidth : "TURBOPACK unreachable",
            height: ("TURBOPACK compile-time truthy", 1) ? window.innerHeight : "TURBOPACK unreachable"
        };
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        this.center = {
            x: this.width / 2,
            y: this.height / 2
        };
        this.coreRadius = Math.max(48, Math.min(this.width, this.height) * 0.08);
        this.seedStars();
    };
    seedStars() {
        const count = Math.round(this.width * this.height / 9000);
        this.stars = Array.from({
            length: count
        }, ()=>({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 1.2 + 0.3,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.3 + Math.random() * 0.6
            }));
    }
    seed() {
        const nodeCount = Math.round(Math.max(20, Math.min(this.width, this.height) / 20));
        const maxOrbit = Math.min(this.width, this.height) * 0.42;
        const minOrbit = this.coreRadius * 2.4;
        this.nodes = Array.from({
            length: nodeCount
        }, (_, i)=>{
            const clusterId = i % this.clusterCount;
            const clusterAngle = clusterId / this.clusterCount * Math.PI * 2;
            const angleJitter = (Math.random() - 0.5) * (Math.PI / this.clusterCount) * 1.6;
            return {
                angle: clusterAngle + angleJitter,
                angularSpeed: (Math.random() * 0.05 + 0.012) * (Math.random() < 0.5 ? -1 : 1),
                radius: minOrbit + Math.random() * (maxOrbit - minOrbit),
                tilt: 0.35 + Math.random() * 0.35,
                radiusJitterPhase: Math.random() * Math.PI * 2,
                size: 2.2 + Math.random() * 3,
                clusterId,
                pulsePhase: Math.random() * Math.PI * 2
            };
        });
        this.satellites = Array.from({
            length: 12
        }, ()=>({
                angle: Math.random() * Math.PI * 2,
                angularSpeed: (Math.random() * 0.025 + 0.006) * (Math.random() < 0.5 ? -1 : 1),
                radius: maxOrbit * (1.1 + Math.random() * 0.2),
                size: 1.2 + Math.random() * 1.3,
                tilt: 0.5 + Math.random() * 0.3
            }));
        this.pulses = Array.from({
            length: Math.round(nodeCount * 0.7)
        }, ()=>this.spawnPulse());
    }
    spawnPulse() {
        return {
            nodeIndex: Math.floor(Math.random() * this.nodes.length),
            progress: Math.random(),
            speed: 0.13 + Math.random() * 0.22,
            outward: Math.random() < 0.5
        };
    }
    /** Orbit position with a z-depth so nodes swing toward/away from camera */ nodePosition3D(node, t) {
        const wobble = Math.sin(t * 0.35 + node.radiusJitterPhase) * (this.coreRadius * 0.12);
        const r = node.radius + wobble;
        const a = node.angle + t * node.angularSpeed;
        return {
            x: this.center.x + Math.cos(a) * r,
            y: this.center.y + Math.sin(a) * r * node.tilt,
            z: Math.sin(a) * (1 - node.tilt)
        };
    }
    depthScale(z) {
        return 1 + z * 0.45;
    }
    drawStars(t) {
        const { ctx } = this;
        const starColor = this.isLight ? this.primaryRgb : [
            255,
            255,
            255
        ];
        for (const star of this.stars){
            const twinkle = 0.4 + 0.35 * Math.sin(t * star.twinkleSpeed + star.twinklePhase);
            ctx.fillStyle = this.rgba(starColor, Math.max(0, twinkle * (this.isLight ? 0.35 : 0.5)));
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    /** Pseudo-3D wireframe sphere: a lat/long grid rotated and projected */ drawCore(t) {
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
        const project = (theta, phi)=>{
            let x = Math.sin(phi) * Math.cos(theta);
            let y = Math.cos(phi);
            let z = Math.sin(phi) * Math.sin(theta);
            const y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
            const z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
            y = y1;
            z = z1;
            const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
            const z2 = -x * Math.sin(rotY) + z * Math.cos(rotY);
            x = x1;
            z = z2;
            return {
                x: center.x + x * r,
                y: center.y + y * r,
                z
            };
        };
        ctx.lineWidth = 1;
        // Latitude rings
        for(let i = 1; i < lats; i++){
            const phi = i / lats * Math.PI;
            ctx.beginPath();
            let started = false;
            for(let j = 0; j <= lons; j++){
                const theta = j / lons * Math.PI * 2;
                const p = project(theta, phi);
                const alpha = (this.isLight ? 0.15 : 0.08) + Math.max(0, p.z) * (this.isLight ? 0.35 : 0.28);
                if (j === 0) {
                    ctx.strokeStyle = this.rgba(this.secondaryRgb, alpha);
                }
                if (!started) {
                    ctx.moveTo(p.x, p.y);
                    started = true;
                } else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }
        // Longitude arcs
        for(let j = 0; j < lons; j++){
            const theta = j / lons * Math.PI * 2;
            ctx.beginPath();
            let started = false;
            let maxZ = -1;
            for(let i = 0; i <= lats; i++){
                const phi = i / lats * Math.PI;
                const p = project(theta, phi);
                maxZ = Math.max(maxZ, p.z);
                if (!started) {
                    ctx.moveTo(p.x, p.y);
                    started = true;
                } else ctx.lineTo(p.x, p.y);
            }
            ctx.strokeStyle = this.rgba(this.secondaryRgb, (this.isLight ? 0.15 : 0.08) + Math.max(0, maxZ) * (this.isLight ? 0.3 : 0.22));
            ctx.stroke();
        }
        // Solid inner core with a hot offset highlight
        const core = ctx.createRadialGradient(center.x - r * 0.3, center.y - r * 0.3, r * 0.05, center.x, center.y, r);
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
        for(let i = 0; i < tickCount; i++){
            const a = i / tickCount * Math.PI * 2 + t * 0.15;
            const active = i % 3 === 0;
            const innerR = r * 1.18;
            const outerR = innerR + (active ? 7 : 3);
            const x1 = center.x + Math.cos(a) * innerR;
            const y1 = center.y + Math.sin(a) * innerR;
            const x2 = center.x + Math.cos(a) * outerR;
            const y2 = center.y + Math.sin(a) * outerR;
            ctx.strokeStyle = this.rgba(this.secondaryRgb, active ? this.isLight ? 0.5 : 0.35 : this.isLight ? 0.25 : 0.15);
            ctx.lineWidth = active ? 1.4 : 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
    drawConnections(t) {
        const { ctx, center } = this;
        for (const node of this.nodes){
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
        for(let c = 0; c < this.clusterCount; c++){
            const clusterNodes = this.nodes.filter((n)=>n.clusterId === c);
            const color = this.clusterColor(c);
            for(let i = 0; i < clusterNodes.length - 1; i++){
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
        const ordered = [
            ...this.nodes
        ].map((n)=>({
                n,
                pos: this.nodePosition3D(n, t)
            })).sort((a, b)=>a.pos.z - b.pos.z);
        const blendMode = this.isLight ? "source-over" : "lighter";
        ctx.globalCompositeOperation = blendMode;
        for (const { n, pos } of ordered){
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
        for (const pulse of this.pulses){
            const node = this.nodes[pulse.nodeIndex];
            if (!node) continue;
            const targetPos = this.nodePosition3D(node, t);
            const from = pulse.outward ? {
                x: center.x,
                y: center.y
            } : targetPos;
            const to = pulse.outward ? targetPos : {
                x: center.x,
                y: center.y
            };
            pulse.progress += dtSeconds * pulse.speed;
            if (pulse.progress >= 1) {
                Object.assign(pulse, this.spawnPulse());
                continue;
            }
            const color = this.clusterColor(node.clusterId);
            const fade = Math.sin(Math.min(1, pulse.progress) * Math.PI);
            for(let s = trailSteps; s >= 0; s--){
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
        for (const sat of this.satellites){
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
        const grad = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.35, width / 2, height / 2, Math.max(width, height) * 0.75);
        const vignetteAlpha = this.isLight ? 0.08 : 0.35;
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, `rgba(0,0,0,${vignetteAlpha})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
    }
    colorCheckCounter = 0;
    frame = (now)=>{
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
function PunkRecordsCoreCanvas({ className = "" }) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rendererRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { themeMode, themePreset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PunkRecordsCoreCanvas.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const renderer = new PunkRecordsCoreRenderer(canvas);
            rendererRef.current = renderer;
            renderer.start();
            const handleResize = {
                "PunkRecordsCoreCanvas.useEffect.handleResize": ()=>{
                    renderer.resize();
                }
            }["PunkRecordsCoreCanvas.useEffect.handleResize"];
            window.addEventListener("resize", handleResize);
            return ({
                "PunkRecordsCoreCanvas.useEffect": ()=>{
                    window.removeEventListener("resize", handleResize);
                    renderer.destroy();
                    rendererRef.current = null;
                }
            })["PunkRecordsCoreCanvas.useEffect"];
        }
    }["PunkRecordsCoreCanvas.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PunkRecordsCoreCanvas.useEffect": ()=>{
            if (rendererRef.current) {
                rendererRef.current.readThemeColors();
            }
        }
    }["PunkRecordsCoreCanvas.useEffect"], [
        themeMode,
        themePreset
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: `absolute inset-0 h-full w-full pointer-events-none ${className}`,
        "aria-hidden": "true"
    }, void 0, false, {
        fileName: "[project]/src/components/theme/renderers/PunkRecordsCore.jsx",
        lineNumber: 538,
        columnNumber: 9
    }, this);
}
_s(PunkRecordsCoreCanvas, "dXWT3D54SCaoNgMtSVer92/5INg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2e$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"]
    ];
});
_c = PunkRecordsCoreCanvas;
var _c;
__turbopack_context__.k.register(_c, "PunkRecordsCoreCanvas");
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
        card: "rgba(19, 28, 46, 0.88)",
        cardHover: "rgba(28, 40, 64, 0.95)",
        text: "#f9fafb",
        textMuted: "#a1a1aa",
        border: "rgba(99, 102, 241, 0.22)",
        hoverBg: "rgba(99, 102, 241, 0.12)",
        dark: {
            primary: "#6366f1",
            secondary: "#a855f7",
            background: "#090d16",
            surface: "#111827",
            card: "rgba(19, 28, 46, 0.88)",
            cardHover: "rgba(28, 40, 64, 0.95)",
            text: "#f9fafb",
            textMuted: "#a1a1aa",
            border: "rgba(99, 102, 241, 0.22)",
            hoverBg: "rgba(99, 102, 241, 0.12)"
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
            border: "rgba(0, 0, 0, 0.12)",
            hoverBg: "rgba(0, 0, 0, 0.05)"
        }
    },
    cyberpunk: {
        name: "Cyberpunk Neon",
        primary: "#ff2a6d",
        secondary: "#05d9e8",
        background: "#070510",
        surface: "#110d24",
        card: "rgba(23, 17, 51, 0.9)",
        cardHover: "rgba(34, 25, 77, 0.95)",
        text: "#ffffff",
        textMuted: "#b8c0ff",
        border: "rgba(255, 42, 109, 0.35)",
        hoverBg: "rgba(255, 42, 109, 0.16)",
        dark: {
            primary: "#ff2a6d",
            secondary: "#05d9e8",
            background: "#070510",
            surface: "#110d24",
            card: "rgba(23, 17, 51, 0.9)",
            cardHover: "rgba(34, 25, 77, 0.95)",
            text: "#ffffff",
            textMuted: "#b8c0ff",
            border: "rgba(255, 42, 109, 0.35)",
            hoverBg: "rgba(255, 42, 109, 0.16)"
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
        primary: "#38bdf8",
        secondary: "#2dd4bf",
        background: "#020d1a",
        surface: "#091e36",
        card: "rgba(15, 41, 71, 0.9)",
        cardHover: "rgba(22, 55, 92, 0.95)",
        text: "#f0f9ff",
        textMuted: "#93c5fd",
        border: "rgba(56, 189, 248, 0.3)",
        hoverBg: "rgba(56, 189, 248, 0.15)",
        dark: {
            primary: "#38bdf8",
            secondary: "#2dd4bf",
            background: "#020d1a",
            surface: "#091e36",
            card: "rgba(15, 41, 71, 0.9)",
            cardHover: "rgba(22, 55, 92, 0.95)",
            text: "#f0f9ff",
            textMuted: "#93c5fd",
            border: "rgba(56, 189, 248, 0.3)",
            hoverBg: "rgba(56, 189, 248, 0.15)"
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
        primary: "#a855f7",
        secondary: "#f43f5e",
        background: "#090414",
        surface: "#150a2b",
        card: "rgba(31, 14, 61, 0.9)",
        cardHover: "rgba(43, 20, 84, 0.95)",
        text: "#fcf5ff",
        textMuted: "#d8b4fe",
        border: "rgba(168, 85, 247, 0.3)",
        hoverBg: "rgba(168, 85, 247, 0.15)",
        dark: {
            primary: "#a855f7",
            secondary: "#f43f5e",
            background: "#090414",
            surface: "#150a2b",
            card: "rgba(31, 14, 61, 0.9)",
            cardHover: "rgba(43, 20, 84, 0.95)",
            text: "#fcf5ff",
            textMuted: "#d8b4fe",
            border: "rgba(168, 85, 247, 0.3)",
            hoverBg: "rgba(168, 85, 247, 0.15)"
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
        primary: "#4ade80",
        secondary: "#10b981",
        background: "#020b05",
        surface: "#071a0e",
        card: "rgba(14, 41, 23, 0.92)",
        cardHover: "rgba(21, 59, 34, 0.96)",
        text: "#f0fdf4",
        textMuted: "#86efac",
        border: "rgba(74, 222, 128, 0.32)",
        hoverBg: "rgba(74, 222, 128, 0.15)",
        dark: {
            primary: "#4ade80",
            secondary: "#10b981",
            background: "#020b05",
            surface: "#071a0e",
            card: "rgba(14, 41, 23, 0.92)",
            cardHover: "rgba(21, 59, 34, 0.96)",
            text: "#f0fdf4",
            textMuted: "#86efac",
            border: "rgba(74, 222, 128, 0.32)",
            hoverBg: "rgba(74, 222, 128, 0.15)"
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
    synthwave: {
        name: "Synthwave Sunset",
        primary: "#ff758f",
        secondary: "#ffb703",
        background: "#12091c",
        surface: "#1d0e2e",
        card: "rgba(39, 20, 59, 0.92)",
        cardHover: "rgba(53, 27, 82, 0.96)",
        text: "#fff5f7",
        textMuted: "#f7aef8",
        border: "rgba(255, 117, 143, 0.32)",
        hoverBg: "rgba(255, 117, 143, 0.16)",
        dark: {
            primary: "#ff758f",
            secondary: "#ffb703",
            background: "#12091c",
            surface: "#1d0e2e",
            card: "rgba(39, 20, 59, 0.92)",
            cardHover: "rgba(53, 27, 82, 0.96)",
            text: "#fff5f7",
            textMuted: "#f7aef8",
            border: "rgba(255, 117, 143, 0.32)",
            hoverBg: "rgba(255, 117, 143, 0.16)"
        },
        light: {
            primary: "#e63946",
            secondary: "#d97706",
            background: "#fff5f5",
            surface: "#ffffff",
            card: "#ffffff",
            cardHover: "#ffe3e3",
            text: "#4a0e17",
            textMuted: "#9b1c31",
            border: "rgba(230, 57, 70, 0.2)",
            hoverBg: "rgba(230, 57, 70, 0.08)"
        }
    },
    minimal: {
        name: "Minimal Clean",
        primary: "#94a3b8",
        secondary: "#64748b",
        background: "#0b0f19",
        surface: "#161e2e",
        card: "rgba(30, 41, 59, 0.92)",
        cardHover: "rgba(42, 56, 79, 0.96)",
        text: "#f8fafc",
        textMuted: "#cbd5e1",
        border: "rgba(148, 163, 184, 0.25)",
        hoverBg: "rgba(148, 163, 184, 0.12)",
        dark: {
            primary: "#94a3b8",
            secondary: "#64748b",
            background: "#0b0f19",
            surface: "#161e2e",
            card: "rgba(30, 41, 59, 0.92)",
            cardHover: "rgba(42, 56, 79, 0.96)",
            text: "#f8fafc",
            textMuted: "#cbd5e1",
            border: "rgba(148, 163, 184, 0.25)",
            hoverBg: "rgba(148, 163, 184, 0.12)"
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
        id: "punk-records-core",
        name: "Core Engine",
        description: "Pure 3D Data Core with orbiting nodes & knowledge stream"
    },
    {
        id: "particles",
        name: "Star Dust + Core",
        description: "Floating glowing constellation nodes merged with Core"
    },
    {
        id: "matrix",
        name: "Matrix Rain + Core",
        description: "Falling binary cyber code streams merged with Core"
    },
    {
        id: "cyber-grid",
        name: "3D Grid + Core",
        description: "Futuristic perspective grid plane merged with Core"
    },
    {
        id: "nebula",
        name: "Plasma Orbs + Core",
        description: "Swirling ambient plasma nebula merged with Core"
    },
    {
        id: "rain",
        name: "Cyber Rain + Core",
        description: "Vertical high-speed rain streaks merged with Core"
    },
    {
        id: "snow",
        name: "Cosmic Snow + Core",
        description: "Drifting gentle snowflakes merged with Core"
    },
    {
        id: "gradient",
        name: "Fluid Wave + Core",
        description: "Dynamic pulsing color mesh waves merged with Core"
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
        motionPreset: "punk-records-core",
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
                motionPreset: "punk-records-core",
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

//# sourceMappingURL=src_18fls1o._.js.map
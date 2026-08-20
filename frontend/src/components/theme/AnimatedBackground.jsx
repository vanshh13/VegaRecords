"use client";

import { useEffect, useRef } from "react";
import { useThemeStore, PRESETS } from "@/stores/theme.store";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const { backgroundType, backgroundImage, backgroundVideo, themePreset, motionPreset, iconShape, themeMode } =
    useThemeStore();

  useEffect(() => {
    if (backgroundType !== "animated") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for dynamic interactive physics
    const mouse = { x: width / 2, y: height / 2 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const preset = PRESETS[themePreset] || PRESETS.default;
    const isLight = themeMode === "light";
    const modeColors = preset[themeMode] || preset;

    const primaryColor = modeColors.primary || preset.primary;
    const secondaryColor = modeColors.secondary || preset.secondary;

    // --- 1. Star / Icon Dust Particles ---
    const codeSymbols = ["</>", "{}", "=>", "01", "⚡", "✨", "VEGA"];
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1.5,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.6 + 0.3,
      symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
    }));

    // --- 2. Matrix Code Rain ---
    const matrixChars = "01VEGARECORDS101";
    const fontSize = 14;
    const columns = Math.max(10, Math.floor(width / fontSize));
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -80));

    // --- 3. Neon Cyber Rain Streaks ---
    const rainDrops = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 25 + 10,
      speed: Math.random() * 8 + 4,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    // --- 4. Ambient Cosmic Snow ---
    const snowFlakes = Array.from({ length: 55 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      speedY: Math.random() * 1.2 + 0.4,
      swing: Math.random() * 0.02,
      step: Math.random() * Math.PI * 2,
    }));

    // --- 5. High-Fidelity Cosmic Plasma Orbs ---
    const plasmaOrbs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseRadius: Math.random() * 180 + 140,
      radius: Math.random() * 180 + 140,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseAngle: Math.random() * Math.PI * 2,
      color: i % 2 === 0 ? primaryColor : secondaryColor,
    }));

    // Embedded Stardust for Cosmic Plasma
    const cosmicStardust = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.7 + 0.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    // --- 6. Fluid Motion Wave Parameters ---
    let waveTime = 0;

    // Canvas Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (motionPreset === "matrix") {
        ctx.fillStyle = isLight ? "rgba(241, 245, 249, 0.2)" : "rgba(9, 13, 22, 0.2)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = primaryColor;
        ctx.font = `${fontSize}px monospace`;

        drops.forEach((y, i) => {
          const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          const x = i * fontSize;
          ctx.fillText(char, x, y * fontSize);

          if (y * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        });
      } else if (motionPreset === "cyber-grid") {
        waveTime = (waveTime + 0.5) % 40;
        ctx.strokeStyle = primaryColor;
        ctx.globalAlpha = isLight ? 0.08 : 0.18;
        ctx.lineWidth = 1;

        for (let x = 0; x <= width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        for (let y = waveTime; y <= height; y += 40) {
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

        plasmaOrbs.forEach((orb) => {
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

          const grad = ctx.createRadialGradient(
            orb.x,
            orb.y,
            orb.radius * 0.05,
            orb.x,
            orb.y,
            orb.radius
          );
          grad.addColorStop(0, orb.color);
          grad.addColorStop(0.5, `${orb.color}60`);
          grad.addColorStop(1, "transparent");

          ctx.globalAlpha = isLight ? 0.15 : 0.28;
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // Render embedded cosmic stardust
        cosmicStardust.forEach((p) => {
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
        });
      } else if (motionPreset === "rain") {
        rainDrops.forEach((d) => {
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
        });
      } else if (motionPreset === "snow") {
        snowFlakes.forEach((s) => {
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
        });
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
        for (let x = 0; x <= width; x += 30) {
          const y =
            height * 0.5 +
            Math.sin(x * 0.004 + waveTime) * 60 +
            Math.cos(x * 0.002 - waveTime * 0.5) * 40;
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
        particles.forEach((p) => {
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
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [backgroundType, themePreset, motionPreset, iconShape, themeMode]);

  if (backgroundType === "image" && backgroundImage) {
    return (
      <div
        className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-700 pointer-events-none opacity-40"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
    );
  }

  if (backgroundType === "video" && backgroundVideo) {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 z-0 w-full h-full object-cover transition-all duration-700 pointer-events-none opacity-30"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
    );
  }

  if (backgroundType === "animated") {
    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 opacity-70"
      />
    );
  }

  return null;
}

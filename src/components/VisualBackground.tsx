
import { useEffect, useRef } from "react";

export default function VisualBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame = 0;
    let animation: number;
    const dpr = window.devicePixelRatio || 1;
    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx?.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw a simple moving circles effect
      const count = 8;
      for (let i = 0; i < count; i++) {
        const angle = ((frame / 80) + (i / count) * Math.PI * 2);
        const x = window.innerWidth / 2 + Math.cos(angle) * 220;
        const y = window.innerHeight / 2 + Math.sin(angle) * 180;
        ctx.beginPath();
        ctx.arc(x, y, 70 + 10 * Math.sin(frame / 30 + i), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${40 * i + frame % 360}, 85%, 74%, 0.23)`;
        ctx.fill();
      }
      frame++;
      animation = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

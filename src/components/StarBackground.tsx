
import { useEffect, useRef } from "react";

/**
 * A minimal outspace background with subtle animated stars.
 * Professional, clean look (matches the STARS theme, non-distracting).
 */
export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animation: number;
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 0.9 + 0.3,
      twinkle: Math.random() * 2 * Math.PI,
    }));

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Space gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#101828"); // deep navy
      gradient.addColorStop(1, "#020617"); // near black
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let s of stars) {
        // twinkling effect
        const tw = Math.abs(Math.sin(s.twinkle + performance.now() / 1500));
        ctx.beginPath();
        ctx.arc(
          s.x,
          s.y,
          s.radius * (0.5 + tw * 0.8),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255,255,255," + (0.24 + tw * 0.38) + ")";
        ctx.shadowColor = "#7bdff2";
        ctx.shadowBlur = 3 * tw;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      animation = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 w-full h-full z-0"
      aria-hidden="true"
      style={{ top: 0, left: 0 }}
    />
  );
}

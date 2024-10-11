'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useEventListener } from '@/hooks/use-event-listener';
import { cn } from '@/lib/utils';

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace('#', '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => char + char)
      .join('');
  }

  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

const circleParams = (canvasWidth: number, canvasHeight: number, size: number): Circle => {
  const x = Math.floor(Math.random() * canvasWidth);
  const y = Math.floor(Math.random() * canvasHeight);
  const translateX = 0;
  const translateY = 0;
  const pSize = Math.floor(Math.random() * 2) + size;
  const alpha = 0;
  const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
  const dx = (Math.random() - 0.5) * 0.1;
  const dy = (Math.random() - 0.5) * 0.1;
  const magnetism = 0.1 + Math.random() * 4;
  return {
    x,
    y,
    translateX,
    translateY,
    size: pSize,
    alpha,
    targetAlpha,
    dx,
    dy,
    magnetism
  };
};

const remapValue = (
  value: number,
  start1: number,
  end1: number,
  start2: number,
  end2: number
): number => {
  const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;

  return remapped > 0 ? remapped : 0;
};

export const Particles: React.FC<ParticlesProps> = ({
  className = '',
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  color = '#ffffff',
  vx = 0,
  vy = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef(0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);

  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    }
  };

  const resizeCanvas = useCallback(() => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  }, []);

  const drawCircle = useCallback(
    (circle: Circle, update = false) => {
      const rgb = hexToRgb(color);

      if (context.current) {
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

        const { x, y, translateX, translateY, size, alpha } = circle;
        context.current.translate(translateX, translateY);
        context.current.beginPath();
        context.current.arc(x, y, size, 0, 2 * Math.PI);
        context.current.fillStyle = `rgba(${rgb.join(', ')}, ${alpha})`;
        context.current.fill();
        context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (!update) {
          circles.current.push(circle);
        }
      }
    },
    [color]
  );

  const animate = useCallback(() => {
    clearContext();

    for (let i = 0; i < circles.current.length; i++) {
      const circle = circles.current[i];

      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left edge
        canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
        circle.y + circle.translateY - circle.size, // distance from top edge
        canvasSize.current.h - circle.y - circle.translateY - circle.size // distance from bottom edge
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

      drawCircle(circle, true);

      // circle gets out of the canvas
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        // remove the circle from the array
        circles.current.splice(i, 1);
        // create a new circle
        const newCircle = circleParams(canvasSize.current.w, canvasSize.current.h, size);
        drawCircle(newCircle);
        // update the circle position
      }
    }

    animationFrameRef.current = window.requestAnimationFrame(animate);
  }, []);

  const drawParticles = useCallback(() => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams(canvasSize.current.w, canvasSize.current.h, size);
      drawCircle(circle);
    }
  }, [quantity, size, drawCircle]);

  const initCanvas = useCallback(() => {
    resizeCanvas();
    drawParticles();
  }, [drawParticles, resizeCanvas]);

  useEffect(() => {
    const animationFrame = animationFrameRef.current;

    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }

    initCanvas();
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [initCanvas, animate]);

  useEventListener('mousemove', e => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = e.clientX - rect.left - w / 2;
      const y = e.clientY - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  });

  useEventListener('resize', initCanvas);

  return (
    <div
      className={cn('pointer-events-none', className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const followerPosRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', onMove);

    const animate = () => {
      followerPosRef.current.x += (posRef.current.x - followerPosRef.current.x) * 0.12;
      followerPosRef.current.y += (posRef.current.y - followerPosRef.current.y) * 0.12;
      if (followerRef.current) {
        followerRef.current.style.left = `${followerPosRef.current.x}px`;
        followerRef.current.style.top = `${followerPosRef.current.y}px`;
      }
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    // Scale on hover of interactive elements
    const onEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.width = '30px';
        cursorRef.current.style.height = '30px';
        cursorRef.current.style.opacity = '0.5';
      }
      if (followerRef.current) {
        followerRef.current.style.width = '60px';
        followerRef.current.style.height = '60px';
      }
    };
    const onLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.width = '20px';
        cursorRef.current.style.height = '20px';
        cursorRef.current.style.opacity = '1';
      }
      if (followerRef.current) {
        followerRef.current.style.width = '40px';
        followerRef.current.style.height = '40px';
      }
    };

    const elements = document.querySelectorAll('button, a, [role="button"], .cursor-none');
    elements.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frameRef.current);
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor hidden md:flex" />
      <div ref={followerRef} className="cursor-follower hidden md:flex" />
    </>
  );
}

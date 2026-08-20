import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer:fine)').matches;
    if (!hasFinePointer) return;

    document.body.classList.add('desktop-cursor');
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0,
      raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top = my + 'px';
      }
    };

    function animRing() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
      }
      raf = requestAnimationFrame(animRing);
    }

    document.addEventListener('mousemove', onMove);
    animRing();

    const onDown = () => document.body.classList.add('c-press');
    const onUp = () => document.body.classList.remove('c-press');
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    const targets = document.querySelectorAll('a,button,.cc,.li,.step-c,.logo,.h-stat,.stat-card');
    const enter = () => document.body.classList.add('c-big');
    const leave = () => document.body.classList.remove('c-big');
    targets.forEach((el) => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
      cancelAnimationFrame(raf);
      document.body.classList.remove('desktop-cursor');
    };
  }, []);

  return (
    <>
      <div id="c-dot" ref={dotRef}></div>
      <div id="c-ring" ref={ringRef}></div>
    </>
  );
}

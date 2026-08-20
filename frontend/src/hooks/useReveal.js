import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Observes all .rv elements on the page and adds .in when they scroll
// into view, matching the original vanilla-JS reveal animation.
export function useReveal(deps = []) {
  const { pathname } = useLocation();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll('.rv:not(.in)').forEach((el) => obs.observe(el));
    }, 50);
    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, ...deps]);
}

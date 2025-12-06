import React, { useEffect, useRef } from 'react'

const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

export function PerfImg({ src, alt, className, width, height, priority }) {
  const ref = useRef(null);
  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    let loaded = false;
    function loadReal() {
      if (loaded) return;
      loaded = true;
      const real = img.getAttribute('data-src');
      if (real) { img.src = real; }
    }
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { loadReal(); io.disconnect(); } });
      }, { rootMargin: '200px 0px' });
      io.observe(img);
      return () => { try { io.disconnect(); } catch (_) {} };
    } else {
      loadReal();
    }
  }, []);
  return (
    <img
      ref={ref}
      className={className}
      src={PLACEHOLDER}
      data-src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      fetchPriority={priority ? 'high' : 'low'}
      width={width}
      height={height}
      style={{ backgroundColor: '#0f1621' }}
    />
  );
}


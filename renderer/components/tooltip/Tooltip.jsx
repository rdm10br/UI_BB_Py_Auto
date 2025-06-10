import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Tooltip({ text, visible }) {
  const tooltipRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);
  let time = 300

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    } else {
      // espera o tempo da transição antes de desmontar
      const timeout = setTimeout(() => setShouldRender(false), time);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const tooltip = tooltipRef.current;
      if (tooltip) {
        tooltip.style.left = `${e.clientX + 15}px`;
        tooltip.style.top = `${e.clientY + 95}px`;
      }
    };

    if (visible) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [visible]);
  
  if (!shouldRender) return null;

  return createPortal(
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: '0%',
        left: '0%',
        margin: 0,
        transform: 'translateY(-350%)',
        padding: '6px 10px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        borderRadius: '4px',
        pointerEvents: 'none',
        zIndex: 2147483647,
        whiteSpace: 'nowrap',
        filter: 'blur(0)',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)',
        opacity: visible ? 1 : 0,
        transition: `opacity ${time}ms ease`,
      }}
    >
      {text}
    </div>,
    document.body
  );
}
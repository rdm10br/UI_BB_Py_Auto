import { useEffect, useRef } from 'react';

export default function Tooltip({ text, visible }) {
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const tooltip = tooltipRef.current;
      if (tooltip) {
        tooltip.style.left = `${e.clientX + 4}px`;
        tooltip.style.top = `${e.clientY + 4}px`;
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

  return (
    <div
      ref={tooltipRef}
      style={{
        // position: 'fixed',
        position: 'absolute',
        top: "0%",
        left: "0%",
        margin: 0,
        transform: "translateY(-350%)",
        padding: '6px 10px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        borderRadius: '4px',
        pointerEvents: 'none',
        zIndex: 2147483647,
        whiteSpace: 'nowrap',
        display: visible ? 'block' : 'none',
        filter: blur(0),
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
        // overflow: 'visible !important',
      }}
    >
      {text}
    </div>
  );
}
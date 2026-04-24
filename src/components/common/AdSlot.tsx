import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  html: string | undefined;
  className?: string;
}

export const AdSlot = ({ html, className = "" }: AdSlotProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && html) {
      containerRef.current.innerHTML = html;
      // Re-execute scripts if any
      const scripts = containerRef.current.getElementsByTagName('script');
      Array.from(scripts).forEach((script: Element) => {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(script.innerHTML));
        script.parentNode?.replaceChild(newScript, script);
      });
    }
  }, [html]);

  if (!html) return null;

  return (
    <div 
      ref={containerRef} 
      className={`ad-slot my-6 py-4 flex justify-center items-center overflow-hidden min-h-[90px] border border-dashed border-slate-200 rounded-xl ${className}`}
    />
  );
};

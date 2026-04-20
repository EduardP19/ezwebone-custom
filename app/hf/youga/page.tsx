"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function YogaPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const lockInteractions = () => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            const style = doc.createElement('style');
            style.innerText = `
              a, button, input, select, textarea, [role="button"], .nav-cta, .btn-primary, .btn-ghost { 
                pointer-events: none !important; 
                cursor: default !important;
              }
              body {
                user-select: none !important;
              }
            `;
            doc.head.appendChild(style);
          }
        } catch (e) {
          console.error("Could not lock interactions:", e);
        }
      };

      iframe.addEventListener('load', lockInteractions);
      return () => iframe.removeEventListener('load', lockInteractions);
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#F7F3EE] overflow-hidden">
      {/* Back Button */}
      <Link 
        href="/hf" 
        className="fixed top-6 left-6 z-[2000] flex items-center gap-2 px-6 py-3 bg-black/10 backdrop-blur-md border border-black/10 rounded-full text-black text-sm font-bold hover:bg-black/20 transition-all shadow-xl"
      >
        <ArrowLeft size={18} /> Back to EZWebOne
      </Link>

      <iframe 
        ref={iframeRef}
        src="/demos/youga/index.html"
        className="w-full h-full border-none"
        title="Yoga Project Preview"
      />
    </div>
  );
}

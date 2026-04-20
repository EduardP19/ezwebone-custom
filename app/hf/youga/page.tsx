"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
            // 1. Inject Style to disable pointer events (Visual focus and direct block)
            const style = doc.createElement('style');
            style.id = 'interaction-lock-style';
            style.innerText = `
              * { 
                pointer-events: none !important; 
                user-select: none !important;
                -webkit-user-drag: none !important;
                cursor: default !important;
              }
              html, body {
                pointer-events: auto !important;
                overflow-x: hidden !important;
              }
              body::-webkit-scrollbar { display: none; }
              body { -ms-overflow-style: none; scrollbar-width: none; }
            `;
            if (!doc.getElementById('interaction-lock-style')) {
              doc.head.appendChild(style);
            }

            // 2. Add Event Listeners at the capture phase to swallow all interaction events
            const swallow = (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
            };
            
            ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'contextmenu'].forEach(type => {
              doc.addEventListener(type, swallow, true);
            });
          }
        } catch (e) {
          console.error("Could not lock interactions:", e);
        }
      };

      iframe.addEventListener('load', lockInteractions);
      lockInteractions();
      return () => iframe.removeEventListener('load', lockInteractions);
    }
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-white flex flex-col overflow-hidden">
      {/* Agency Toolbar - REVERSED LAYOUT */}
      <nav className="demo-toolbar h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-[2000] shadow-sm">
        {/* Left Side: Exit Button */}
        <div className="flex items-center gap-3">
          <Link 
            href="/hf#ecosystem" 
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[11px] font-bold hover:bg-gray-800 transition-all shadow-md"
          >
            <ArrowLeft size={14} /> Exit Preview
          </Link>
        </div>

        {/* Right Side: Logo and Info */}
        <div className="flex items-center gap-4 text-right">
          <div className="hidden md:flex flex-col">
            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Live Preview</span>
            <span className="text-xs font-bold text-black">Wellness & Mindfulness</span>
          </div>
          <div className="h-4 w-px bg-gray-200 hidden md:block" />
          <Link href="/hf" className="hover:opacity-60 transition-opacity">
            <img src="/brand/HF_EZ-Navy-Tear.png" alt="EZWebOne" className="h-8 w-auto" />
          </Link>
        </div>
      </nav>

      {/* Preview Container */}
      <div className="flex-grow p-0 md:p-6 bg-gray-100 relative overflow-hidden">
        <div className="w-full h-full bg-white rounded-none md:rounded-xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col">
          <iframe 
            ref={iframeRef}
            src="/demos/youga/index.html"
            className="w-full h-full border-none"
            title="Yoga Project Preview"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

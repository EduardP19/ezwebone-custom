"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function YogaPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const lock = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        if (!doc.getElementById('absolute-lock')) {
          const style = doc.createElement('style');
          style.id = 'absolute-lock';
          style.innerText = `
            * { 
              pointer-events: none !important; 
              cursor: default !important;
              user-select: none !important;
              -webkit-user-drag: none !important;
              touch-action: pan-y !important;
            }
            html, body {
              pointer-events: auto !important;
              cursor: default !important;
            }
          `;
          doc.head.appendChild(style);
        }

        const swallow = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        };

        const win = iframe.contentWindow;
        if (win) {
          ['click', 'dblclick', 'mousedown', 'mouseup', 'contextmenu', 'submit'].forEach(type => {
            win.addEventListener(type, swallow, true);
          });
        }
      } catch (e) {}
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', lock);
      lock();
      intervalId = setInterval(lock, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-white flex flex-col overflow-hidden">
      {/* Agency Toolbar */}
      <nav className="demo-toolbar h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-[2000] shadow-sm">
        <div className="flex items-center gap-3">
          <Link 
            href="/hf#ecosystem" 
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[11px] font-bold hover:bg-gray-800 transition-all shadow-md"
          >
            <ArrowLeft size={14} /> Exit Preview
          </Link>
        </div>

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

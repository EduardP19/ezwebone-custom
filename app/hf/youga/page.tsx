"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function YogaPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc && !doc.getElementById('ez-preview-lock')) {
        const style = doc.createElement('style');
        style.id = 'ez-preview-lock';
        style.innerText = `
          a, button, input, select, textarea, [role="button"],
          .hamburger, .mobile-menu-close, [class*="burger"], [id*="hamburger"], label, summary { 
            pointer-events: none !important; 
            cursor: default !important;
          }
        `;
        doc.head.appendChild(style);
      }
    } catch (e) {}
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-white flex flex-col overflow-hidden">
      {/* Agency Toolbar */}
      <nav className="demo-toolbar min-h-[64px] py-2 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-[2000] shadow-sm">
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
          <Link href="/hf" className="hover:opacity-60 transition-opacity block">
            <img src="/brand/HF_EZ-Navy-Tear.png" alt="EZWebOne" className="h-[6rem] md:h-24 w-auto object-contain" />
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
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

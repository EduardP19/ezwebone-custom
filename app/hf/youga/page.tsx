"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function YogaPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // We force the parent main container to lose its top padding and hide global layout parts
    const main = document.querySelector('main');
    const nav = document.querySelector('nav:not(.demo-toolbar)');
    const footer = document.querySelector('footer');

    if (main) {
      main.classList.remove('pt-24', 'md:pt-28');
      main.style.paddingTop = '0';
    }
    if (nav instanceof HTMLElement) nav.style.display = 'none';
    if (footer instanceof HTMLElement) footer.style.display = 'none';

    return () => {
      if (main) {
        main.classList.add('pt-24', 'md:pt-28');
        main.style.paddingTop = '';
      }
      if (nav instanceof HTMLElement) nav.style.display = '';
      if (footer instanceof HTMLElement) footer.style.display = '';
    };
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const lockInteractions = () => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            const style = doc.createElement('style');
            style.innerText = `
              /* Nuclear Read-Only: Disable interaction on EVERYTHING */
              * { 
                pointer-events: none !important; 
                user-select: none !important;
                -webkit-user-drag: none !important;
              }
              
              /* Except the root, to allow scrolling */
              html, body {
                pointer-events: auto !important;
                overflow-x: hidden !important;
              }

              /* Hide scrollbars for a cleaner look if desired, but keep scrolling */
              body::-webkit-scrollbar {
                display: none;
              }
              body {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `;
            doc.head.appendChild(style);
          }
        } catch (e) {
          console.error("Could not lock interactions:", e);
        }
      };

      iframe.addEventListener('load', lockInteractions);
      // Fallback for fast loads
      lockInteractions();
      
      return () => iframe.removeEventListener('load', lockInteractions);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[5000] bg-white flex flex-col overflow-hidden">
      {/* Agency Toolbar */}
      <nav className="demo-toolbar h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-[2000] shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/hf" className="hover:opacity-60 transition-opacity">
            <img src="/brand/HF_EZ-Navy-Tear.png" alt="EZWebOne" className="h-8 w-auto" />
          </Link>
          <div className="h-4 w-px bg-gray-200 hidden md:block" />
          <div className="hidden md:flex flex-col">
            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Live Preview</span>
            <span className="text-sm font-bold text-black">Wellness & Mindfulness</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full text-[9px] font-bold text-green-700 uppercase tracking-widest">
            <ShieldCheck size={10} /> Interactions Disabled
          </div>
          <Link 
            href="/hf#ecosystem" 
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[11px] font-bold hover:bg-gray-800 transition-all shadow-md"
          >
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Exit Preview</span>
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
    </div>
  );
}

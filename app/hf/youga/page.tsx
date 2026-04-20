"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

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
    <div className="relative w-full h-screen bg-[#F5F2ED] flex flex-col overflow-hidden">
      {/* Agency Toolbar */}
      <nav className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-[2000] shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/hf" className="hover:opacity-60 transition-opacity">
            <img src="/brand/HF_EZ-Navy-Tear.png" alt="EZWebOne" className="h-10 w-auto" />
          </Link>
          <div className="h-6 w-px bg-gray-200 hidden md:block" />
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Live Preview</span>
            <span className="text-sm font-bold text-black">Wellness & Mindfulness</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full text-[10px] font-bold text-green-700 uppercase tracking-widest">
            <ShieldCheck size={12} /> Interactions Disabled
          </div>
          <Link 
            href="/hf#ecosystem" 
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-all shadow-lg"
          >
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Exit Preview</span>
          </Link>
        </div>
      </nav>

      {/* Preview Container */}
      <div className="flex-grow p-0 md:p-4 bg-[#F5F2ED] relative overflow-hidden">
        <div className="w-full h-full bg-white rounded-none md:rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
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

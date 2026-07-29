import React from 'react';
import { BookOpen } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: 'home' | 'models' | 'docs' | 'lab') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {

  return (
    <footer className="mt-auto border-t-2 border-navy bg-cream py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column: Branding & Installation */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl text-navy">Option Pricing</span>
          </div>
          <p className="text-sm text-navy-light max-w-sm">
            A lightweight Python library for numerical methods and analytic pricing models in quantitative finance.
          </p>
        </div>

        {/* Center column: Pages Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display font-semibold text-xl text-navy">Toolkit Map</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-navy-light">
            <button 
              onClick={() => setActivePage('home')} 
              className="text-left hover:text-gold transition-colors font-medium cursor-pointer"
            >
              Home Page
            </button>
            <button 
              onClick={() => setActivePage('models')} 
              className="text-left hover:text-gold transition-colors font-medium cursor-pointer"
            >
              Models Directory
            </button>
            <button 
              onClick={() => setActivePage('docs')} 
              className="text-left hover:text-gold transition-colors font-medium cursor-pointer"
            >
              Library Docs
            </button>
            <button 
              onClick={() => setActivePage('lab')} 
              className="text-left hover:text-gold transition-colors font-medium cursor-pointer"
            >
              Interactive Lab
            </button>
          </div>
        </div>

        {/* Right column: Resources */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display font-semibold text-xl text-navy">Resources</h4>
          <div className="flex gap-4">
            <a
              href="https://github.com/lightbender62/Option-pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border-2 border-navy bg-white rounded-xl shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--color-navy)] transition-all font-display font-semibold text-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              <span>GitHub</span>
            </a>
            <button
              onClick={() => setActivePage('docs')}
              className="flex items-center gap-2 px-4 py-2 border-2 border-navy bg-white rounded-xl shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--color-navy)] transition-all font-display font-semibold text-sm cursor-pointer"
            >
              <BookOpen size={16} />
              <span>API Reference</span>
            </button>
          </div>
          <p className="text-xs text-navy-light">
            An educational project exploring modern option pricing techniques.
          </p>
        </div>

      </div>
    </footer>
  );
};
export default Footer;

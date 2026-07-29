import React from 'react';
import { BookOpen, Compass, Activity, Home, Terminal } from 'lucide-react';

interface NavbarProps {
  activePage: 'home' | 'models' | 'docs' | 'lab';
  setActivePage: (page: 'home' | 'models' | 'docs' | 'lab') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'models' as const, label: 'Models', icon: Compass },
    { id: 'docs' as const, label: 'Documentation', icon: BookOpen },
    { id: 'lab' as const, label: 'Quant Lab', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4 bg-bg border-b-2 border-navy">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <div
          onClick={() => {
            setActivePage('home');
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
          }
          className="flex items-center gap-3 cursor-pointer group"
          id="navbar-logo"
        >
          <div className="p-2 bg-gold border-2 border-navy rounded-xl shadow-brutal-sm group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:shadow-[1px_1px_0px_0px_var(--color-navy)] transition-all">
            <Terminal size={24} className="text-navy" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-navy m-0 flex items-center gap-2">
              Option Pricing
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 md:gap-3 flex-wrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth", // or "auto"
                  });
                }}
                className={`flex items-center gap-2 px-4 py-2 font-display font-semibold text-sm md:text-base border-2 border-navy rounded-xl transition-all duration-150 cursor-pointer ${isActive
                    ? 'bg-gold text-navy shadow-brutal-sm translate-x-[2px] translate-y-[2px]'
                    : 'bg-cream text-navy shadow-brutal hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none'
                  }`}
                id={`nav-${item.id}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
export default Navbar;

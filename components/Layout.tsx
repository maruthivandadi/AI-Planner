
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: any) => void;
  hideNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, hideNav = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-primary selection:bg-accent/20">
      <header className="py-6 px-8 flex justify-between items-center border-b border-secondary/5 bg-primary/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary font-serif font-bold text-xl shadow-sm rotate-3">
            S
          </div>
          <h1 className="text-2xl font-serif font-bold text-secondary tracking-tight">Sophos</h1>
        </div>
        
        {!hideNav && (
          <nav className="hidden md:flex space-x-10 text-xs font-bold uppercase tracking-widest text-secondary/40">
            <button 
              onClick={() => onNavigate('dashboard')} 
              className={`hover:text-accent transition-colors ${activeView === 'dashboard' ? 'text-accent' : ''}`}
            >
              Exams
            </button>
            <button 
              onClick={() => onNavigate('syllabus')} 
              className={`hover:text-accent transition-colors ${activeView === 'syllabus' ? 'text-accent' : ''}`}
            >
              Syllabus
            </button>
            <button 
              onClick={() => onNavigate('progress')} 
              className={`hover:text-accent transition-colors ${activeView === 'progress' ? 'text-accent' : ''}`}
            >
              Progress
            </button>
            <button 
              onClick={() => onNavigate('insights')} 
              className={`hover:text-accent transition-colors ${activeView === 'insights' ? 'text-accent' : ''}`}
            >
              Insights
            </button>
          </nav>
        )}
        
        <div className="w-10 md:hidden"></div>
      </header>
      
      <main className="flex-grow flex flex-col container mx-auto px-6 max-w-6xl">
        {children}
      </main>
      
      <footer className="py-12 mt-12 border-t border-secondary/5 text-center">
        <div className="flex justify-center space-x-6 mb-4 opacity-30">
          <div className="w-1 h-1 bg-secondary rounded-full"></div>
          <div className="w-1 h-1 bg-secondary rounded-full"></div>
          <div className="w-1 h-1 bg-secondary rounded-full"></div>
        </div>
        <p className="font-serif italic text-secondary/30 text-sm tracking-wide">
          &copy; 2024 Sophos — Elevating Academic Achievement through Intelligent Design.
        </p>
      </footer>
    </div>
  );
};

export default Layout;

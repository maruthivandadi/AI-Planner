
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: any) => void;
  hideNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, hideNav = false }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-accent/10">
      <header className="py-6 px-12 flex justify-between items-center z-50 sticky top-0 bg-mutedBlue/80 backdrop-blur-2xl border-b border-accent/10 shadow-[0_2px_20px_rgba(0,86,210,0.03)]">
        <div 
          className="flex items-center space-x-5 group cursor-pointer" 
          onClick={() => onNavigate('landing')}
        >
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-accent rounded-full blur-xl opacity-10 group-hover:opacity-30 transition-opacity duration-1000"></div>
            <div className="relative w-full h-full bg-secondary rounded-full flex items-center justify-center shadow-lg transition-transform duration-700 group-hover:scale-110">
              <div className="w-3 h-3 bg-white rounded-[1px] rotate-45 group-hover:rotate-180 transition-transform duration-1000"></div>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-secondary tracking-luxury group-hover:text-accent transition-colors duration-500 uppercase">Aura</h1>
          </div>
        </div>
        
        {!hideNav && (
          <nav className="hidden md:flex items-center space-x-12">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'syllabus', label: 'Syllabus' },
              { id: 'progress', label: 'Velocity' },
              { id: 'insights', label: 'Oracle' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)} 
                className={`text-[9px] font-bold uppercase tracking-luxury transition-all duration-500 relative py-2 group ${
                  activeView === item.id ? 'text-accent' : 'text-slate hover:text-secondary'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-all duration-700 ${
                  activeView === item.id ? 'w-full' : 'w-0 group-hover:w-4'
                }`}></span>
              </button>
            ))}
          </nav>
        )}
        
        <div className="hidden md:flex items-center space-x-4">
           <div className="text-right">
             <div className="text-[7px] font-black text-slate/40 tracking-widest uppercase mb-1">Architect v3.1</div>
             <div className="text-[9px] font-bold text-secondary tracking-widest uppercase flex items-center justify-end">
               <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
               Live
             </div>
           </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col container mx-auto px-10 max-w-7xl pt-12">
        {children}
      </main>
      
      <footer className="py-24 text-center border-t border-black/[0.03] mt-32 relative overflow-hidden">
        <p className="font-serif italic text-secondary/60 text-sm tracking-widest max-w-md mx-auto leading-relaxed">
          The orchestrated application of focus is the ultimate cognitive luxury.
        </p>
        <div className="mt-10 flex justify-center items-center space-x-6 opacity-40">
           <div className="h-[1px] w-8 bg-black"></div>
           <div className="text-[8px] font-black text-secondary uppercase tracking-[0.8em]">Aura Sovereign</div>
           <div className="h-[1px] w-8 bg-black"></div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

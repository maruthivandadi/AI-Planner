
import React from 'react';
import { StudyPlan } from '../types';

interface InsightsViewProps {
  plan: StudyPlan;
}

const InsightsView: React.FC<InsightsViewProps> = ({ plan }) => {
  return (
    <div className="py-12 animate-fade-in space-y-16">
      <div>
        <h2 className="text-5xl font-serif font-bold text-secondary mb-4 italic tracking-tight">Strategic Oracle</h2>
        <p className="text-slate/60 font-light max-w-xl">Deep pattern recognition mapping your cognitive efficiency to temporal windows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="p-10 bg-accent/[0.03] border border-accent/10 rounded-[3rem] space-y-6 group hover:border-accent/30 transition-all">
          <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-accent shadow-xl border border-white/5">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-2xl font-serif italic text-secondary/90">Temporal Efficiency</h3>
          <p className="text-sm text-slate/60 leading-relaxed font-light">
            Analysis reveals your peak cognitive resonance occurs <span className="text-accent font-bold">Post-Dawn</span>. Aura has shifted your highest-priority vectors into 06:00 - 10:00 windows.
          </p>
        </div>

        <div className="p-10 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[3rem] space-y-6 group hover:border-emerald-500/30 transition-all">
          <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-emerald shadow-xl border border-white/5">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <h3 className="text-2xl font-serif italic text-secondary/90">Memory Consolidation</h3>
          <p className="text-sm text-slate/60 leading-relaxed font-light">
            Ebbinghaus redistribution is active. Your <span className="font-bold text-emerald">Revision Nodes</span> are currently spaced at 1, 3, and 7-day intervals to ensure deep-structural retention.
          </p>
        </div>

        <div className="p-10 bg-sky-500/[0.03] border border-sky-500/10 rounded-[3rem] space-y-6 group hover:border-sky-500/30 transition-all">
          <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-sky shadow-xl border border-white/5">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 className="text-2xl font-serif italic text-secondary/90">Cognitive Fatigue</h3>
          <p className="text-sm text-slate/60 leading-relaxed font-light">
            {plan.burnoutWarning || "Your neurological load is currently optimal. Maintain current break cycles to prevent pre-deadline exhaustion."}
          </p>
        </div>
      </div>

      <div className="glass-card p-16 rounded-[4rem] border-accent/10 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <h3 className="text-3xl font-serif font-bold italic text-secondary mb-6 tracking-tight relative z-10">The Architectural Mandate</h3>
        <p className="max-w-2xl mx-auto text-slate/60 font-light leading-relaxed mb-10 relative z-10 italic">
          "Mastery is not a singular event; it is the iterative application of focused intent against the grain of time."
        </p>
        <div className="flex justify-center space-x-3 relative z-10">
          <div className="w-1.5 h-1.5 bg-accent/20 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-accent/50 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_#D4AF37]"></div>
        </div>
      </div>
    </div>
  );
};

export default InsightsView;

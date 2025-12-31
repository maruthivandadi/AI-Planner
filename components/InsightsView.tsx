
import React from 'react';
import { StudyPlan } from '../types';

interface InsightsViewProps {
  plan: StudyPlan;
}

const InsightsView: React.FC<InsightsViewProps> = ({ plan }) => {
  return (
    <div className="py-12 animate-fade-in space-y-12">
      <div>
        <h2 className="text-4xl font-bold text-secondary mb-2">Strategic Insights</h2>
        <p className="text-slate-400 font-medium">AI-powered pattern recognition to optimize your cognitive performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-accent shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-secondary">Optimal Energy Window</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Based on your session completion data, you perform <span className="text-accent font-bold">24% better</span> during Morning slots. 
            The AI has prioritized high-difficulty topics for these windows.
          </p>
        </div>

        <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-secondary">Retention Curve</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Active recall sessions for <span className="font-bold">Calculus</span> are scheduled every 3 days. This follows the Ebbinghaus forgetting curve for maximum long-term retention.
          </p>
        </div>

        <div className="p-8 bg-amber-50 border border-amber-100 rounded-[2.5rem] space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-secondary">Burnout Warning</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {plan.burnoutWarning || "Your schedule is currently healthy. Maintain your 15-minute breaks after every 3 Pomodoros to prevent cognitive fatigue."}
          </p>
        </div>
      </div>

      <div className="glass-card p-12 rounded-[3rem] border-white text-center">
        <h3 className="text-2xl font-bold font-serif italic text-secondary mb-4">The Sophos Mentality</h3>
        <p className="max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed mb-8">
          "Consistency is the bedrock of brilliance. Do not seek the grand gesture; seek the daily discipline."
        </p>
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-accent rounded-full opacity-20"></div>
          <div className="w-2 h-2 bg-accent rounded-full opacity-60"></div>
          <div className="w-2 h-2 bg-accent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default InsightsView;

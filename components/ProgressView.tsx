
import React from 'react';
import { StudyPlan, Subject } from '../types';

interface ProgressViewProps {
  plan: StudyPlan;
  subjects: Subject[];
}

const ProgressView: React.FC<ProgressViewProps> = ({ plan, subjects }) => {
  const allTasks = plan.dailySchedules.flatMap(d => d.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'completed').length;
  const progressPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="py-12 animate-fade-in space-y-16">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-serif font-bold text-secondary mb-4 italic tracking-tight">Mastery Velocity</h2>
          <p className="text-slate font-light max-w-xl">A cold, precise calculation of your dedication and the temporal distance to academic dominance.</p>
        </div>
        <div className="flex items-baseline space-x-4">
          <span className="text-7xl font-black text-accent italic tracking-tighter">{progressPct}%</span>
          <span className="text-slate/50 font-black uppercase tracking-[0.4em] text-[10px]">Trajectory</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="glass-card p-12 rounded-sm relative overflow-hidden border border-black/[0.04]">
            <div className="absolute top-0 right-0 p-12">
              <svg className="w-20 h-20 text-accent/5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
            </div>
            <h3 className="text-2xl font-serif italic text-secondary mb-12">Syllabus Resolution</h3>
            <div className="space-y-12">
              {subjects.map(subject => {
                const subTasks = allTasks.filter(t => t.subject === subject.name);
                const subCompleted = subTasks.filter(t => t.status === 'completed').length;
                const subPct = subTasks.length ? Math.round((subCompleted / subTasks.length) * 100) : 0;
                
                return (
                  <div key={subject.id} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-secondary text-sm tracking-widest uppercase">{subject.name}</span>
                      <span className="text-[10px] font-black text-slate/50 uppercase tracking-widest">{subCompleted} / {subTasks.length} Units</span>
                    </div>
                    <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-1000 shadow-[0_0_10px_rgba(0,86,210,0.2)]" 
                        style={{ width: `${subPct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-black/[0.04] p-10 rounded-sm shadow-xl">
            <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.5em] mb-10">Obsidian Metrics</h3>
            <div className="space-y-10">
              <div className="flex justify-between items-center border-b border-black/[0.04] pb-6">
                <span className="text-slate text-xs font-bold uppercase tracking-widest">Cognitive Hours</span>
                <span className="font-black text-2xl text-secondary">{Math.round((completedTasks * 25) / 60)}h</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/[0.04] pb-6">
                <span className="text-slate text-xs font-bold uppercase tracking-widest">Units Resolved</span>
                <span className="font-black text-2xl text-secondary">{completedTasks}</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/[0.04] pb-6">
                <span className="text-slate text-xs font-bold uppercase tracking-widest">Active Streak</span>
                <span className="font-black text-2xl text-accent">{plan.streak} Cycles</span>
              </div>
            </div>
          </div>
          
          <div className="bg-mutedBlue p-10 rounded-sm flex items-center space-x-6 border border-accent/10">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
            <div>
              <p className="font-black text-secondary text-sm uppercase tracking-widest">Aura Sovereign</p>
              <p className="text-[10px] text-accent font-black uppercase mt-1 tracking-tighter">Tier: Architectural Master</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressView;

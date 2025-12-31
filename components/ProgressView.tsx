
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
    <div className="py-12 animate-fade-in space-y-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-bold text-secondary mb-2">Academic Trajectory</h2>
          <p className="text-slate-400 font-medium">Quantifying your dedication and mapping the distance to mastery.</p>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-bold text-accent">{progressPct}%</span>
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Overall Velocity</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10 rounded-[3rem] border-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <svg className="w-16 h-16 text-accent/5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-8">Completion Statistics</h3>
            <div className="space-y-8">
              {subjects.map(subject => {
                const subTasks = allTasks.filter(t => t.subject === subject.name);
                const subCompleted = subTasks.filter(t => t.status === 'completed').length;
                const subPct = subTasks.length ? Math.round((subCompleted / subTasks.length) * 100) : 0;
                
                return (
                  <div key={subject.id} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-secondary">{subject.name}</span>
                      <span className="text-xs font-bold text-slate-400">{subCompleted}/{subTasks.length} Sessions</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-1000" 
                        style={{ width: `${subPct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary p-8 rounded-[2.5rem] text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-6">Focus Metrics</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-indigo-200 text-sm">Deep Work Hours</span>
                <span className="font-bold text-xl">{Math.round((completedTasks * 25) / 60)}h</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-indigo-200 text-sm">Pomodoros Complete</span>
                <span className="font-bold text-xl">{completedTasks}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-indigo-200 text-sm">Avg. Daily Output</span>
                <span className="font-bold text-xl">4.2h</span>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-8 rounded-[2.5rem] border-white shadow-sm">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">Mastery Badge</h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
              <div>
                <p className="font-bold text-secondary">Consistent Scholar</p>
                <p className="text-xs text-slate-400 italic">Maintaining 3+ days of output</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressView;

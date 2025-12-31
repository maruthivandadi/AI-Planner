
import React, { useState } from 'react';
import { StudyPlan, Subject, Exam, DailySchedule, StudyTask } from '../types';
import FocusTimer from './FocusTimer';
import { jsPDF } from 'jspdf';

interface DashboardProps {
  plan: StudyPlan;
  subjects: Subject[];
  exams: Exam[];
  onUpdatePlan: (newPlan: StudyPlan) => void;
  onReschedule: (missedTasks: StudyTask[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ plan, subjects, exams, onUpdatePlan, onReschedule }) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  
  const activeDay = plan.dailySchedules[activeDayIndex];
  const activeTask = activeDay?.tasks.find(t => t.id === activeTaskId);

  const toggleTaskStatus = (taskId: string, status: 'completed' | 'missed' | 'pending') => {
    const newSchedules = plan.dailySchedules.map(day => ({
      ...day,
      tasks: day.tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      )
    }));
    onUpdatePlan({ ...plan, dailySchedules: newSchedules });
  };

  const getOverallProgress = () => {
    const allTasks = plan.dailySchedules.flatMap(d => d.tasks);
    const completed = allTasks.filter(t => t.status === 'completed').length;
    return allTasks.length ? Math.round((completed / allTasks.length) * 100) : 0;
  };

  const handleTaskReschedule = () => {
    const missed = activeDay.tasks.filter(t => t.status === 'missed' || t.status === 'pending');
    onReschedule(missed);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("AURA - COGNITIVE BLUEPRINT", 20, 30);
    doc.save(`Aura_Blueprint_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-20 animate-fade-in-up pb-32">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-10 rounded-sm border border-black/[0.04] shadow-sm flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors"></div>
          <p className="text-[8px] font-black text-slate uppercase tracking-[0.5em] mb-4">Streak</p>
          <p className="text-4xl font-light text-secondary">
            {plan.streak} <span className="text-[10px] font-black text-accent uppercase tracking-widest">Cycles</span>
          </p>
        </div>
        
        <div className="bg-white p-10 rounded-sm border border-black/[0.04] shadow-sm flex flex-col justify-between">
          <p className="text-[8px] font-black text-slate uppercase tracking-[0.5em] mb-4">Mastery</p>
          <p className="text-4xl font-light text-secondary">
            {getOverallProgress()}<span className="text-xs font-black text-accent ml-1 opacity-40">%</span>
          </p>
        </div>

        <div className="md:col-span-2 bg-white p-10 rounded-sm border border-accent/20 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-accent">
             <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" /></svg>
          </div>
          <div>
            <p className="text-[8px] font-black text-accent uppercase tracking-[0.5em] mb-4">The Architect's Decree</p>
            <p className="text-xl font-serif italic text-secondary leading-relaxed font-light">"{plan.recommendation}"</p>
          </div>
          <div className="flex items-center space-x-6 mt-8">
            <button onClick={handleTaskReschedule} className="text-[8px] font-black text-slate hover:text-accent uppercase tracking-[0.4em] transition-colors">Resync Logic</button>
            <button onClick={exportToPDF} className="text-[8px] font-black text-accent hover:text-black uppercase tracking-[0.4em] transition-colors">Export Blueprint</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="flex-grow w-full lg:w-0 space-y-12">
          <div className="space-y-10">
            <div className="flex justify-between items-end border-b border-black/[0.04] pb-8">
              <div>
                 <h2 className="text-4xl font-serif text-secondary tracking-tight">Timeline</h2>
                 <p className="text-[8px] font-black text-slate uppercase tracking-[0.5em] mt-3">Active Operational Cycle</p>
              </div>
              <div className="flex bg-black/[0.02] border border-black/5 p-1 rounded-sm">
                <button onClick={() => setViewMode('daily')} className={`px-10 py-2.5 rounded-sm text-[8px] font-black uppercase tracking-luxury transition-all ${viewMode === 'daily' ? 'bg-accent text-white' : 'text-slate hover:text-secondary'}`}>Daily</button>
                <button onClick={() => setViewMode('weekly')} className={`px-10 py-2.5 rounded-sm text-[8px] font-black uppercase tracking-luxury transition-all ${viewMode === 'weekly' ? 'bg-accent text-white' : 'text-slate hover:text-secondary'}`}>Weekly</button>
              </div>
            </div>

            {viewMode === 'daily' && (
              <div className="flex items-center space-x-4 overflow-x-auto pb-8 scroll-hide">
                {plan.dailySchedules.map((day, idx) => {
                  const d = new Date(day.date);
                  const active = activeDayIndex === idx;
                  return (
                    <button 
                      key={day.date} 
                      onClick={() => setActiveDayIndex(idx)} 
                      className={`flex flex-col items-center min-w-[85px] py-8 border transition-all duration-500 rounded-sm ${
                        active 
                        ? 'bg-accent border-accent text-white shadow-xl -translate-y-1' 
                        : 'bg-white border-black/10 text-slate hover:border-accent/40'
                      }`}
                    >
                      <span className={`text-[7px] font-black uppercase tracking-[0.4em] mb-4 ${active ? 'opacity-60' : 'opacity-30'}`}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-2xl font-light">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {activeDay?.tasks.map(task => (
              <div 
                key={task.id} 
                className={`group flex items-center p-10 border transition-all duration-1000 cursor-pointer rounded-sm ${
                  activeTaskId === task.id ? 'bg-mutedBlue border-accent shadow-sm' : 'bg-white border-black/[0.04] hover:border-accent/30'
                } ${task.status === 'completed' ? 'opacity-30 grayscale' : ''}`} 
                onClick={() => setActiveTaskId(task.id)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-10 transition-all duration-700 border ${
                  task.status === 'completed' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-black/[0.02] border-black/5 text-slate group-hover:border-accent group-hover:text-accent'
                }`}>
                  {task.status === 'completed' ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : <span className="text-[10px] font-black">{task.sessions}</span>}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-accent">{task.subject}</span>
                    <span className="w-1 h-1 bg-black/10 rounded-full"></span>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate/50">{task.bestTime} Focus</span>
                  </div>
                  <h4 className="font-serif text-2xl text-secondary tracking-tight font-light">{task.topic}</h4>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-700 ml-8">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task.id, 'completed'); }} 
                    className="px-8 py-3 bg-accent text-white text-[8px] font-black uppercase tracking-[0.3em] transition-all hover:bg-black"
                  >
                    Seal Task
                  </button>
                </div>
              </div>
            ))}
            {activeDay?.tasks.length === 0 && (
              <div className="py-24 text-center border border-dashed border-black/[0.08] rounded-sm">
                <p className="text-slate/40 font-serif italic text-xl font-light">A period of cognitive stillness.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[400px] space-y-12 lg:sticky lg:top-36">
          <FocusTimer 
            initialMinutes={activeTask?.sessions ? 25 : 25} 
            taskTitle={activeTask?.topic || 'Select a Focus Unit'} 
            onComplete={() => activeTask && toggleTaskStatus(activeTask.id, 'completed')} 
          />
          
          <div className="bg-white p-10 rounded-sm border border-black/[0.04] shadow-sm relative">
            <h3 className="text-[8px] font-black text-secondary uppercase tracking-[0.6em] mb-10 opacity-30">Imminent Criticals</h3>
            <div className="space-y-8">
              {exams.map(e => (
                <div key={e.id} className="group cursor-default relative pl-5 border-l border-black/10">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-secondary text-xs tracking-tight group-hover:text-accent transition-colors">{e.subjectName}</span>
                    <span className="text-[9px] font-black text-accent tracking-tighter italic">
                      T - {Math.max(0, Math.ceil((new Date(e.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))}d
                    </span>
                  </div>
                  <span className="text-[7px] font-black text-slate/40 uppercase tracking-[0.3em]">{formatDate(e.date)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


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
    doc.setFontSize(22);
    doc.text("Sophos - AI Study Plan", 20, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Recommendation: ${plan.recommendation}`, 20, 30, { maxWidth: 170 });
    
    let y = 50;
    plan.dailySchedules.forEach((day, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(new Date(day.date).toLocaleDateString(), 20, y);
      y += 10;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      day.tasks.forEach(task => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`• [${task.subject}] ${task.topic} - ${task.sessions} sessions (${task.bestTime})`, 25, y);
        y += 7;
      });
      y += 10;
    });
    
    doc.save("Sophos_Study_Plan.pdf");
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-8 rounded-[2.5rem] flex items-center space-x-5 border-white shadow-xl">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-accent">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Streak</p>
            <p className="text-2xl font-bold text-secondary">{plan.streak} Days</p>
          </div>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] flex items-center space-x-5 border-white shadow-xl">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Done</p>
            <p className="text-2xl font-bold text-secondary">{getOverallProgress()}%</p>
          </div>
        </div>
        <div className="md:col-span-2 glass-card p-8 rounded-[2.5rem] flex items-center justify-between border-white shadow-xl">
          <div className="pr-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Insight</p>
            <p className="text-sm font-serif italic text-secondary mt-2 line-clamp-2">"{plan.recommendation}"</p>
          </div>
          <div className="flex flex-col space-y-2">
            <button onClick={handleTaskReschedule} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase hover:bg-red-50 hover:text-red-500 transition-all">Resync</button>
            <button onClick={exportToPDF} className="px-4 py-2 bg-accent text-white rounded-xl text-[10px] font-bold uppercase hover:bg-indigo-600 transition-all">Export PDF</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="flex-grow w-full lg:w-0 space-y-8">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-secondary font-serif">Protocol</h2>
              <div className="bg-slate-100 p-1.5 rounded-2xl flex">
                <button onClick={() => setViewMode('daily')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase ${viewMode === 'daily' ? 'bg-white shadow-md text-secondary' : 'text-slate-400'}`}>Daily</button>
                <button onClick={() => setViewMode('weekly')} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase ${viewMode === 'weekly' ? 'bg-white shadow-md text-secondary' : 'text-slate-400'}`}>Weekly</button>
              </div>
            </div>

            {viewMode === 'daily' && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-4 -mx-2 px-2 scroll-hide">
                {plan.dailySchedules.map((day, idx) => {
                  const d = new Date(day.date);
                  const active = activeDayIndex === idx;
                  return (
                    <button key={day.date} onClick={() => setActiveDayIndex(idx)} className={`flex flex-col items-center min-w-[70px] py-4 rounded-[2rem] border-2 transition-all ${active ? 'bg-secondary border-secondary text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-accent'}`}>
                      <span className="text-[10px] font-bold uppercase opacity-60">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-xl font-bold">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {activeDay?.tasks.map(task => (
              <div key={task.id} className={`group flex items-center p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer ${activeTaskId === task.id ? 'bg-white border-accent shadow-2xl scale-[1.01]' : 'bg-white/60 border-slate-100'} ${task.status === 'completed' ? 'opacity-40' : ''}`} onClick={() => setActiveTaskId(task.id)}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-6 transition-all ${task.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-accent group-hover:text-white'}`}>
                  {task.status === 'completed' ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : <span className="font-bold text-xs">{task.sessions}x</span>}
                </div>
                <div className="flex-grow">
                  <span className="text-[10px] font-bold uppercase text-accent/70">{task.subject}</span>
                  <h4 className="font-bold text-secondary text-xl font-serif">{task.topic}</h4>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task.id, 'completed'); }} className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-[10px] uppercase transition-all">Done</button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-8 sticky top-24">
          <FocusTimer initialMinutes={activeTask?.sessions ? 25 : 25} taskTitle={activeTask?.topic || 'Select a session'} onComplete={() => activeTask && toggleTaskStatus(activeTask.id, 'completed')} />
          <div className="glass-card p-10 rounded-[3rem] border-white shadow-xl">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-6">Upcoming Exams</h3>
            <div className="space-y-4">
              {exams.map(e => (
                <div key={e.id} className="flex justify-between items-center text-sm">
                  <span className="font-bold text-secondary">{e.subjectName}</span>
                  <span className="text-slate-400">{e.date}</span>
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

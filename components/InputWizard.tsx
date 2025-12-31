
import React, { useState } from 'react';
import { Exam, Subject, Topic, Difficulty, UserPreferences, Priority } from '../types';

interface InputWizardProps {
  onComplete: (exams: Exam[], subjects: Subject[], prefs: UserPreferences) => void;
  onBack: () => void;
}

const InputWizard: React.FC<InputWizardProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [prefs, setPrefs] = useState<UserPreferences>({ 
    dailyHours: 4, 
    studyStyle: 'balanced',
    pomodoroLength: 25,
    breakLength: 5
  });

  const [newSubject, setNewSubject] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  
  const [topicInputs, setTopicInputs] = useState<Record<string, string>>({});

  const addSubjectAndExam = () => {
    if (!newSubject || !newExamDate) return;
    const sId = Math.random().toString(36).substr(2, 9);
    const sub: Subject = { id: sId, name: newSubject, priority: newPriority, topics: [] };
    const ex: Exam = { id: Math.random().toString(36).substr(2, 9), subjectId: sId, subjectName: newSubject, date: newExamDate };
    
    setSubjects([...subjects, sub]);
    setExams([...exams, ex]);
    setNewSubject('');
    setNewExamDate('');
  };

  const handleTopicInputChange = (subjectId: string, value: string) => {
    setTopicInputs(prev => ({ ...prev, [subjectId]: value }));
  };

  const addTopicToSubject = (subjectId: string) => {
    const val = topicInputs[subjectId];
    if (!val) return;
    const topic: Topic = {
      id: Math.random().toString(36).substr(2, 9),
      name: val,
      difficulty: 'medium',
      completed: false
    };
    setSubjects(subjects.map(s => s.id === subjectId ? { ...s, topics: [...s.topics, topic] } : s));
    setTopicInputs(prev => ({ ...prev, [subjectId]: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-20 text-center">
        <h2 className="text-5xl font-serif text-secondary mb-8 italic tracking-tight">Onboarding</h2>
        <div className="flex justify-center space-x-4 items-center">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`h-[1px] transition-all duration-1000 ${step === s ? 'w-20 bg-accent shadow-sm' : 'w-8 bg-black/[0.08]'}`} />
              {s < 3 && <div className="w-1.5 h-1.5 bg-black/[0.1] rounded-full"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-sm p-16 shadow-2xl border border-black/[0.04] relative">
        {step === 1 && (
          <div className="space-y-12 animate-fade-in-up">
            <div className="space-y-2">
               <h3 className="text-3xl font-serif text-secondary italic font-light">Target Registry</h3>
               <p className="text-slate text-[9px] uppercase tracking-luxury opacity-50">Specify the terminal subjects and critical deadlines.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-3">
                <label className="text-[8px] font-black text-slate uppercase tracking-[0.4em] ml-1">Subject Nomenclature</label>
                <input 
                  className="w-full bg-transparent border-b border-black/[0.08] py-5 text-xl text-secondary focus:border-accent outline-none font-sans font-light tracking-tight transition-all"
                  placeholder="e.g. Theoretical Ethics"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[8px] font-black text-slate uppercase tracking-[0.4em] ml-1">Critical Deadline</label>
                <input 
                  type="date"
                  className="w-full bg-transparent border-b border-black/[0.08] py-5 text-xl text-secondary focus:border-accent outline-none cursor-pointer font-sans font-light tracking-tight transition-all"
                  value={newExamDate}
                  onChange={e => setNewExamDate(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={addSubjectAndExam}
              className="w-full py-6 border border-black/10 text-secondary hover:border-accent hover:text-accent transition-all duration-700 font-black uppercase tracking-[0.4em] text-[9px] flex items-center justify-center space-x-4 group"
            >
              <span>Add to Ledger</span>
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            </button>
            <div className="flex justify-between items-center pt-12 border-t border-black/[0.05]">
              <button onClick={onBack} className="text-slate/40 text-[8px] font-bold uppercase tracking-luxury hover:text-secondary transition-colors">Abort Sync</button>
              <button disabled={exams.length === 0} onClick={() => setStep(2)} className="px-16 py-5 bg-accent text-white rounded-[2px] font-black uppercase tracking-[0.4em] text-[9px] disabled:opacity-20 transition-all hover:bg-black shadow-lg shadow-accent/10">Proceed to Elements</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-12 animate-fade-in-up">
            <div className="space-y-2">
              <h3 className="text-3xl font-serif text-secondary italic font-light">Neural Units</h3>
              <p className="text-slate text-[9px] uppercase tracking-luxury opacity-50">Deconstruct subjects into precise cognitive study topics.</p>
            </div>
            
            <div className="max-h-[450px] overflow-y-auto space-y-8 pr-4 scroll-hide">
              {subjects.map(sub => (
                <div key={sub.id} className="p-10 bg-black/[0.02] border border-black/[0.04] rounded-sm">
                  <h4 className="font-serif italic text-2xl text-accent mb-8">{sub.name}</h4>
                  <div className="flex flex-wrap gap-3 mb-10">
                    {sub.topics.map(t => (
                      <span key={t.id} className="px-5 py-1.5 bg-white border border-black/[0.08] rounded-full text-[8px] font-black text-slate uppercase tracking-widest">{t.name}</span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <input 
                      className="flex-grow bg-transparent border-b border-black/[0.08] py-3 text-md focus:border-accent outline-none transition-all font-sans font-light tracking-tight"
                      placeholder="Specify Operational Topic..."
                      value={topicInputs[sub.id] || ''}
                      onChange={e => handleTopicInputChange(sub.id, e.target.value)}
                    />
                    <button onClick={() => addTopicToSubject(sub.id)} className="px-10 py-3 bg-accent text-white text-[8px] font-black uppercase tracking-luxury hover:bg-black transition-all">Add</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-12 border-t border-black/[0.05]">
              <button onClick={() => setStep(1)} className="text-slate/40 text-[8px] font-bold uppercase tracking-luxury">Back to Registry</button>
              <button onClick={() => setStep(3)} className="px-16 py-5 bg-accent text-white rounded-[2px] font-black uppercase tracking-[0.4em] text-[9px] shadow-lg shadow-accent/10">Set Parameters</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-16 animate-fade-in-up">
             <div className="space-y-2 text-center">
              <h3 className="text-3xl font-serif text-secondary italic font-light">Architectural Config</h3>
              <p className="text-slate text-[9px] uppercase tracking-[0.6em] opacity-50">Calibrate the temporal density and operational style.</p>
            </div>
            
            <div className="max-md mx-auto space-y-16">
              <div className="space-y-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate/50 font-bold uppercase tracking-[0.5em] text-[8px]">Daily Budget</span>
                  <span className="text-accent font-light text-5xl italic tracking-tighter">{prefs.dailyHours}h</span>
                </div>
                <input type="range" min="1" max="12" step="0.5" className="w-full h-[2px] bg-black/[0.08] appearance-none accent-accent cursor-pointer" value={prefs.dailyHours} onChange={e => setPrefs({...prefs, dailyHours: parseFloat(e.target.value)})} />
              </div>
              
              <div className="space-y-4">
                <label className="text-[8px] font-black text-slate/50 uppercase tracking-[0.5em] block">Operational Protocol</label>
                <select className="w-full bg-transparent border-b border-black/[0.08] py-4 text-lg font-sans font-light tracking-tight text-secondary outline-none cursor-pointer focus:border-accent">
                  <option value="balanced">Balanced Synergy</option>
                  <option value="revision-first">Deep Retention</option>
                  <option value="sprint">Efficiency Sprint</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-16 border-t border-black/[0.05]">
              <button onClick={() => setStep(2)} className="text-slate/40 text-[8px] font-bold uppercase tracking-luxury">Return to Units</button>
              <button onClick={() => onComplete(exams, subjects, prefs)} className="px-24 py-7 bg-accent text-white rounded-[2px] font-black uppercase tracking-[0.5em] text-[10px] shadow-2xl shadow-accent/20 hover:bg-black transition-all">Generate Blueprint</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputWizard;


import React, { useState } from 'react';
import { Exam, Subject, Topic, Difficulty, UserPreferences, StudyStyle, Priority } from '../types';

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
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('medium');

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
      difficulty: newDifficulty,
      completed: false
    };
    setSubjects(subjects.map(s => s.id === subjectId ? { ...s, topics: [...s.topics, topic] } : s));
    setTopicInputs(prev => ({ ...prev, [subjectId]: '' }));
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold mb-4 text-secondary font-serif">The Blueprints</h2>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-16 bg-accent' : 'w-6 bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <div className="glass-card rounded-[3rem] p-10 shadow-2xl border-white bg-white/90 transition-all">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary">Upcoming Missions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Subject Name</label>
                <input 
                  className="w-full bg-white border-2 border-slate-300 rounded-2xl p-4 text-secondary focus:border-accent outline-none"
                  placeholder="e.g. Advanced Calculus"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Exam Date</label>
                <div className="relative">
                  <input 
                    type="date"
                    className="w-full bg-white border-2 border-slate-300 rounded-2xl p-4 text-secondary focus:border-accent outline-none cursor-pointer"
                    value={newExamDate}
                    onChange={e => setNewExamDate(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={addSubjectAndExam}
              className="group w-full py-5 bg-slate-100 text-secondary rounded-2xl hover:bg-accent hover:text-white transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Add Exam Entry</span>
              <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </button>
            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
              <button onClick={onBack} className="text-slate-400 font-bold hover:text-secondary">Back</button>
              <button disabled={exams.length === 0} onClick={() => setStep(2)} className="px-12 py-4 bg-accent text-white rounded-2xl font-bold shadow-lg shadow-indigo-200">Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary">Syllabus Breakdown</h3>
            <div className="h-[460px] overflow-y-auto space-y-6 pr-4">
              {subjects.map(sub => (
                <div key={sub.id} className="p-6 border-2 border-slate-200 rounded-3xl bg-white shadow-sm">
                  <h4 className="font-bold text-secondary mb-4">{sub.name}</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {sub.topics.map(t => (
                      <span key={t.id} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">{t.name}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      className="flex-grow bg-white border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-accent outline-none"
                      placeholder="Enter Topic..."
                      value={topicInputs[sub.id] || ''}
                      onChange={e => handleTopicInputChange(sub.id, e.target.value)}
                    />
                    <button onClick={() => addTopicToSubject(sub.id)} className="px-6 py-3 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-accent transition-all">Add</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
              <button onClick={() => setStep(1)} className="text-slate-400 font-bold hover:text-secondary">Back</button>
              <button onClick={() => setStep(3)} className="px-12 py-4 bg-accent text-white rounded-2xl font-bold shadow-lg shadow-indigo-200">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-secondary">Final Settings</h3>
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <span className="text-secondary font-bold uppercase tracking-widest text-xs">Daily Available Hours</span>
                <span className="text-accent font-bold text-2xl">{prefs.dailyHours}h</span>
              </div>
              <input type="range" min="1" max="12" step="0.5" className="w-full h-2 bg-slate-200 rounded-full appearance-none accent-accent" value={prefs.dailyHours} onChange={e => setPrefs({...prefs, dailyHours: parseFloat(e.target.value)})} />
            </div>
            <div className="flex justify-between items-center pt-10 border-t border-slate-100">
              <button onClick={() => setStep(2)} className="text-slate-400 font-bold hover:text-secondary">Back</button>
              <button onClick={() => onComplete(exams, subjects, prefs)} className="px-12 py-5 bg-secondary text-white rounded-[2rem] font-bold hover:bg-accent shadow-2xl transition-all active:scale-95">Generate Path</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputWizard;

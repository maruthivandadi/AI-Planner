
import React, { useState } from 'react';
import Layout from './components/Layout';
import InputWizard from './components/InputWizard';
import Dashboard from './components/Dashboard';
import SyllabusView from './components/SyllabusView';
import ProgressView from './components/ProgressView';
import InsightsView from './components/InsightsView';
import { Exam, Subject, UserPreferences, StudyPlan, StudyTask } from './types';
import { generateStudyPlan } from './services/geminiService';

const App: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [prefs, setPrefs] = useState<UserPreferences>({
    dailyHours: 4,
    studyStyle: 'balanced',
    pomodoroLength: 25,
    breakLength: 5
  });
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'landing' | 'wizard' | 'dashboard' | 'syllabus' | 'progress' | 'insights'>('landing');

  const handleStartWizard = () => setView('wizard');

  const handleWizardComplete = async (ex: Exam[], sub: Subject[], pr: UserPreferences) => {
    setIsLoading(true);
    setExams(ex);
    setSubjects(sub);
    setPrefs(pr);
    
    try {
      const generatedPlan = await generateStudyPlan(ex, sub, pr);
      setPlan(generatedPlan);
      setView('dashboard');
    } catch (error) {
      console.error("Plan generation failed", error);
      alert("Cognitive sync interrupted. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReschedule = async (missedTasks: StudyTask[]) => {
    setIsLoading(true);
    try {
      const newPlan = await generateStudyPlan(exams, subjects, prefs, plan, missedTasks);
      setPlan(newPlan);
    } catch (error) {
      console.error("Reschedule failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlan = (newPlan: StudyPlan) => {
    setPlan(newPlan);
  };

  return (
    <Layout activeView={view} onNavigate={setView} hideNav={view === 'landing' || view === 'wizard'}>
      {view === 'landing' && (
        <div className="flex-grow flex flex-col items-center justify-center text-center animate-fade-in-up min-h-[70vh] py-12 relative">
          <div className="mb-12 inline-flex items-center space-x-4 px-8 py-2 bg-white/50 border border-black/[0.04] rounded-full backdrop-blur-xl">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-30"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
            </span>
            <span className="text-secondary/60 text-[9px] font-black uppercase tracking-[0.4em]">Protocol: Clarity</span>
          </div>
          
          <h1 className="text-7xl md:text-[8rem] font-serif font-normal text-secondary mb-12 leading-[0.9] tracking-[-0.03em]">
            Syllabus, <br />
            <span className="italic text-accent font-light">Redefined.</span>
          </h1>
          
          <p className="max-w-xl text-lg text-slate mb-20 font-light leading-relaxed px-8 tracking-elegant opacity-90">
            Aura distillates academic chaos into a singular, graceful roadmap. Elevating effort into effortless focus.
          </p>
          
          <div className="flex flex-col items-center space-y-8">
            <button 
              onClick={handleStartWizard}
              className="group relative px-20 py-6 bg-accent text-white rounded-[2px] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 hover:bg-black hover:scale-[1.02] active:scale-95 shadow-2xl shadow-accent/20"
            >
              <span className="flex items-center space-x-6">
                <span>Enter Architect</span>
                <svg className="w-5 h-5 transition-transform duration-700 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </button>
            <p className="text-[8px] font-black text-slate/50 tracking-[0.6em] uppercase">No Account Required</p>
          </div>
        </div>
      )}

      {view === 'wizard' && !isLoading && (
        <div className="py-12">
          <InputWizard onComplete={handleWizardComplete} onBack={() => setView('landing')} />
        </div>
      )}

      {isLoading && (
        <div className="flex-grow flex flex-col items-center justify-center space-y-16 text-center py-40">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border border-black/[0.05] rounded-full"></div>
            <div className="absolute inset-0 border-t border-accent rounded-full animate-spin"></div>
            <div className="absolute inset-6 border border-black/[0.05] rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-secondary rounded-sm animate-pulse"></div>
            </div>
          </div>
          <div className="max-w-xs space-y-4">
            <h2 className="text-2xl font-serif text-secondary italic tracking-tight">Syncing Oracle</h2>
            <p className="text-slate font-bold text-[8px] uppercase tracking-[0.4em] leading-relaxed opacity-60">Mapping your journey through the Neural engine.</p>
          </div>
        </div>
      )}

      {view === 'dashboard' && plan && (
        <div className="py-12">
          <Dashboard 
            plan={plan} 
            subjects={subjects} 
            exams={exams} 
            onUpdatePlan={updatePlan} 
            onReschedule={handleReschedule}
          />
        </div>
      )}

      {view === 'syllabus' && <SyllabusView subjects={subjects} />}
      {view === 'progress' && plan && <ProgressView plan={plan} subjects={subjects} />}
      {view === 'insights' && plan && <InsightsView plan={plan} />}
    </Layout>
  );
};

export default App;

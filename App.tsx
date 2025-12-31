
import React, { useState, useEffect } from 'react';
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
      console.error("Failed to generate plan:", error);
      alert("Something went wrong with our AI mentor. Please try again.");
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
      console.error("Reschedule failed:", error);
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
        <div className="flex-grow flex flex-col items-center justify-center text-center animate-fade-in py-12 md:py-32">
          <div className="mb-8 inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-bold uppercase tracking-widest shadow-sm">
            AI Focus & Productivity Engine
          </div>
          
          <h1 className="serif-heading text-6xl md:text-7xl lg:text-8xl text-secondary mb-12 leading-[1.1] tracking-tight px-4 mt-12">
            Master your syllabus. <br />
            <span className="text-accent">Calmly.</span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-slate-500 mb-16 font-medium leading-relaxed px-6">
            Sophos intelligently transforms your deadlines into a balanced path of focus sessions, smart breaks, and consistent progress.
          </p>
          
          <div className="flex justify-center mb-24">
            <button 
              onClick={handleStartWizard}
              className="group px-12 py-5 bg-secondary text-white rounded-3xl text-lg font-bold hover:bg-accent shadow-2xl shadow-indigo-200 transform hover:-translate-y-1 active:scale-95 transition-all flex items-center space-x-3"
            >
              <span>Initialize AI Mentor</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {view === 'wizard' && !isLoading && (
        <div className="py-12 animate-fade-in">
          <InputWizard onComplete={handleWizardComplete} onBack={() => setView('landing')} />
        </div>
      )}

      {isLoading && (
        <div className="flex-grow flex flex-col items-center justify-center space-y-8 text-center px-4">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-slate-100 rounded-full"></div>
            <div className="w-24 h-24 border-8 border-accent border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <h2 className="text-3xl font-bold text-secondary mb-3">Syncing Your Trajectory</h2>
        </div>
      )}

      {view === 'dashboard' && plan && (
        <div className="py-12 animate-fade-in">
          <Dashboard 
            plan={plan} 
            subjects={subjects} 
            exams={exams} 
            onUpdatePlan={updatePlan} 
            onReschedule={handleReschedule}
          />
        </div>
      )}

      {view === 'syllabus' && (
        <SyllabusView subjects={subjects} />
      )}

      {view === 'progress' && plan && (
        <ProgressView plan={plan} subjects={subjects} />
      )}

      {view === 'insights' && plan && (
        <InsightsView plan={plan} />
      )}
    </Layout>
  );
};

export default App;


import React from 'react';
import { Subject } from '../types';

interface SyllabusViewProps {
  subjects: Subject[];
}

const SyllabusView: React.FC<SyllabusViewProps> = ({ subjects }) => {
  return (
    <div className="py-12 animate-fade-in space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-secondary mb-2">Syllabus Breakdown</h2>
          <p className="text-slate-400 font-medium">Your complete academic landscape across all registered subjects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map(subject => (
          <div key={subject.id} className="glass-card p-8 rounded-[2.5rem] border-white hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-secondary group-hover:text-accent transition-colors">{subject.name}</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                subject.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-accent'
              }`}>
                {subject.priority} Priority
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Core Topics</span>
                <span>{subject.topics.length} Total</span>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {subject.topics.map(topic => (
                  <div key={topic.id} className="flex items-center p-4 bg-white/60 border border-slate-100 rounded-2xl group/topic hover:border-accent/30 transition-all">
                    <div className={`w-4 h-4 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                      topic.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 group-hover/topic:border-accent/40'
                    }`}>
                      {topic.completed && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                    </div>
                    <div className="flex-grow">
                      <p className={`text-sm font-bold ${topic.completed ? 'text-slate-300 line-through' : 'text-secondary'}`}>{topic.name}</p>
                      <span className={`text-[9px] uppercase font-bold tracking-widest ${
                        topic.difficulty === 'hard' ? 'text-red-300' : topic.difficulty === 'medium' ? 'text-amber-300' : 'text-emerald-300'
                      }`}>
                        {topic.difficulty} level
                      </span>
                    </div>
                  </div>
                ))}
                {subject.topics.length === 0 && (
                  <p className="text-sm text-slate-300 italic text-center py-6">No topics recorded for this syllabus yet.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyllabusView;

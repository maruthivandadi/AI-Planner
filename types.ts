
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Priority = 'high' | 'medium' | 'low';
export type StudyStyle = 'balanced' | 'revision-first' | 'sprint';

export interface Topic {
  id: string;
  name: string;
  difficulty: Difficulty;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  priority: Priority;
  topics: Topic[];
}

export interface Exam {
  id: string;
  subjectId: string;
  subjectName: string;
  date: string;
}

export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  duration: number; // total mins
  sessions: number; // number of pomodoros
  bestTime: string; // e.g. "Morning", "Evening"
  type: 'study' | 'revision' | 'review' | 'buffer';
  status: 'pending' | 'completed' | 'missed';
}

export interface DailySchedule {
  date: string;
  tasks: StudyTask[];
}

export interface StudyPlan {
  dailySchedules: DailySchedule[];
  recommendation: string;
  burnoutWarning?: string;
  streak: number;
}

export interface UserPreferences {
  dailyHours: number;
  studyStyle: StudyStyle;
  pomodoroLength: number; // default 25
  breakLength: number;    // default 5
}


import { GoogleGenAI, Type } from "@google/genai";
import { Exam, Subject, UserPreferences, StudyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStudyPlan = async (
  exams: Exam[],
  subjects: Subject[],
  prefs: UserPreferences,
  existingPlan?: StudyPlan | null,
  missedTasks?: any[]
): Promise<StudyPlan> => {
  const isRescheduling = !!missedTasks && missedTasks.length > 0;
  
  const prompt = `
    Role: Senior Academic Coach & Productive Architect.
    Task: Generate ${isRescheduling ? 'a RESCHEDULED' : 'a new'} intelligent study plan.
    
    Student Profile:
    - Exams: ${JSON.stringify(exams)}
    - Syllabus Details: ${JSON.stringify(subjects)}
    - Preferences: ${prefs.dailyHours} hrs/day, Style: ${prefs.studyStyle}, Pomodoro: ${prefs.pomodoroLength}min.
    ${isRescheduling ? `- MISSED SESSIONS TO REDISTRIBUTE: ${JSON.stringify(missedTasks)}` : ''}
    
    Requirements:
    1. Break topics into tasks. Each task needs:
       - 'sessions': Number of ${prefs.pomodoroLength}-min focus blocks.
       - 'bestTime': Optimal energy window (Morning, Afternoon, Evening).
    2. Prioritize by: Exam Proximity > Subject Priority > Topic Difficulty.
    3. Include 'revision' tasks for topics learned >3 days ago.
    4. Provide a empathetic, motivating 'recommendation'.
    5. Plan exactly 14 days from ${new Date().toISOString().split('T')[0]}.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dailySchedules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      subject: { type: Type.STRING },
                      topic: { type: Type.STRING },
                      duration: { type: Type.NUMBER },
                      sessions: { type: Type.NUMBER },
                      bestTime: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['study', 'revision', 'review', 'buffer'] },
                      status: { type: Type.STRING, enum: ['pending', 'completed', 'missed'] }
                    },
                    required: ["id", "subject", "topic", "sessions", "type", "bestTime"]
                  }
                }
              },
              required: ["date", "tasks"]
            }
          },
          recommendation: { type: Type.STRING },
          burnoutWarning: { type: Type.STRING }
        },
        required: ["dailySchedules", "recommendation"]
      }
    }
  });

  const parsed = JSON.parse(response.text);
  return { ...parsed, streak: existingPlan?.streak || 0 };
};

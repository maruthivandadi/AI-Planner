
import { GoogleGenAI, Type } from "@google/genai";
import { Exam, Subject, UserPreferences, StudyPlan } from "../types";

export const generateStudyPlan = async (
  exams: Exam[],
  subjects: Subject[],
  prefs: UserPreferences,
  existingPlan?: StudyPlan | null,
  missedTasks?: any[]
): Promise<StudyPlan> => {
  // Always initialize fresh to ensure latest API key context
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const isRescheduling = !!missedTasks && missedTasks.length > 0;
  
  const prompt = `
    Role: Senior Academic Coach & Productive Architect.
    Task: Generate ${isRescheduling ? 'a RESCHEDULED' : 'a new'} intelligent study plan for the next 14 days.
    
    Student Profile:
    - Exams: ${JSON.stringify(exams)}
    - Syllabus Details: ${JSON.stringify(subjects)}
    - Preferences: ${prefs.dailyHours} hrs/day, Style: ${prefs.studyStyle}, Focus Unit: ${prefs.pomodoroLength}min.
    ${isRescheduling ? `- MISSED SESSIONS TO REDISTRIBUTE: ${JSON.stringify(missedTasks)}` : ''}
    
    Requirements:
    1. Output a day-by-day schedule.
    2. Prioritize tasks based on exam dates and subject difficulty.
    3. Include a motivational 'recommendation' as if you are a mentor.
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

  // Guidelines: Access .text property directly
  const textContent = response.text;
  if (!textContent) throw new Error("AI returned empty content");
  
  const parsed = JSON.parse(textContent);
  return { ...parsed, streak: existingPlan?.streak || 0 };
};

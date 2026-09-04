"use client";

import { create } from "zustand";
import {
  DayEvent,
  DayEventSchema,
  RecoveryContext,
  Symptoms,
} from "@/lib/contracts/day";
import { AnalysisResponse } from "@/lib/contracts/plan";
import demoDays from "@/data/demo-days.json";

const defaultMaya = demoDays.personas[0];

const initialSymptoms: Symptoms = {
  headache: defaultMaya.symptoms.headache,
  dizziness: defaultMaya.symptoms.dizziness,
  lightNoise: defaultMaya.symptoms.lightNoise,
  fogginess: defaultMaya.symptoms.fogginess,
  fatigue: defaultMaya.symptoms.fatigue,
  mood: defaultMaya.symptoms.mood,
  anxiety: defaultMaya.symptoms.anxiety,
  sleepQuality: defaultMaya.symptoms.sleepQuality,
};

const initialContext: RecoveryContext = {
  daysSinceInjury: defaultMaya.context.daysSinceInjury,
  setting: defaultMaya.context.setting as "school" | "work" | "both" | "other",
  clinicianSeen: defaultMaya.context.clinicianSeen,
  feelingUnableToCope: defaultMaya.context.feelingUnableToCope,
};

const initialEvents: DayEvent[] = defaultMaya.events.map((e) =>
  DayEventSchema.parse(e)
);

interface SessionState {
  symptoms: Symptoms;
  context: RecoveryContext;
  dangerSignsSelected: string[];
  events: DayEvent[];
  analysisResult: AnalysisResponse | null;
  activePersonaId: string;
  isAnalyzing: boolean;

  setSymptoms: (updates: Partial<Symptoms>) => void;
  setContext: (updates: Partial<RecoveryContext>) => void;
  setDangerSigns: (signs: string[]) => void;
  setEvents: (events: DayEvent[]) => void;
  addEvent: (event: DayEvent) => void;
  updateEvent: (id: string, updates: Partial<DayEvent>) => void;
  deleteEvent: (id: string) => void;
  loadPersona: (personaId: string) => boolean;
  setAnalysisResult: (result: AnalysisResponse | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  resetToMaya: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  symptoms: initialSymptoms,
  context: initialContext,
  dangerSignsSelected: [],
  events: initialEvents,
  analysisResult: null,
  activePersonaId: "maya-day-5",
  isAnalyzing: false,

  setSymptoms: (updates) =>
    set((state) => ({ symptoms: { ...state.symptoms, ...updates } })),

  setContext: (updates) =>
    set((state) => ({ context: { ...state.context, ...updates } })),

  setDangerSigns: (signs) => set({ dangerSignsSelected: signs }),

  setEvents: (events) => set({ events }),

  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),

  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),

  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),

  loadPersona: (personaId: string) => {
    const found = demoDays.personas.find((p) => p.id === personaId);
    if (!found) return false;

    set({
      symptoms: {
        headache: found.symptoms.headache,
        dizziness: found.symptoms.dizziness,
        lightNoise: found.symptoms.lightNoise,
        fogginess: found.symptoms.fogginess,
        fatigue: found.symptoms.fatigue,
        mood: found.symptoms.mood,
        anxiety: found.symptoms.anxiety,
        sleepQuality: found.symptoms.sleepQuality,
      },
      context: {
        daysSinceInjury: found.context.daysSinceInjury,
        setting: found.context.setting as "school" | "work" | "both" | "other",
        clinicianSeen: found.context.clinicianSeen,
        feelingUnableToCope: found.context.feelingUnableToCope,
      },
      dangerSignsSelected: found.dangerSigns || [],
      events: found.events.map((e) => DayEventSchema.parse(e)),
      activePersonaId: found.id,
      analysisResult: null,
    });
    return true;
  },

  setAnalysisResult: (result) => set({ analysisResult: result }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  resetToMaya: () => {
    set({
      symptoms: initialSymptoms,
      context: initialContext,
      dangerSignsSelected: [],
      events: initialEvents,
      analysisResult: null,
      activePersonaId: "maya-day-5",
    });
  },
}));

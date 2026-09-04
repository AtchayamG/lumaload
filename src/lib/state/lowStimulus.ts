"use client";

import { create } from "zustand";

interface LowStimulusState {
  isLowStimulus: boolean;
  toggleLowStimulus: () => void;
  setLowStimulus: (val: boolean) => void;
}

export const useLowStimulus = create<LowStimulusState>((set) => ({
  isLowStimulus: false,
  toggleLowStimulus: () =>
    set((state) => {
      const next = !state.isLowStimulus;
      if (typeof window !== "undefined") {
        localStorage.setItem("lumaload_low_stimulus", next ? "true" : "false");
        document.documentElement.setAttribute(
          "data-low-stimulus",
          next ? "true" : "false"
        );
      }
      return { isLowStimulus: next };
    }),
  setLowStimulus: (val: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lumaload_low_stimulus", val ? "true" : "false");
      document.documentElement.setAttribute(
        "data-low-stimulus",
        val ? "true" : "false"
      );
    }
    set({ isLowStimulus: val });
  },
}));

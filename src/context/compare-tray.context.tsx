"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface CompareModelItem {
  slug: string;
  name: string;
  labName: string;
}

interface CompareTrayContextType {
  selectedModels: CompareModelItem[];
  addModel: (model: CompareModelItem) => boolean;
  removeModel: (slug: string) => void;
  clearTray: () => void;
  isInTray: (slug: string) => boolean;
  canAdd: boolean;
  navigateToCompare: () => void;
}

const CompareTrayContext = createContext<CompareTrayContextType | undefined>(undefined);

const MAX_COMPARE_MODELS = 4;
const STORAGE_KEY = "oneatlas_compare_tray";

export function CompareTrayProvider({ children }: { children: React.ReactNode }) {
  const [selectedModels, setSelectedModels] = useState<CompareModelItem[]>([]);
  const router = useRouter();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSelectedModels(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load compare tray from storage", e);
    }
  }, []);

  // Save to localStorage whenever modified
  const updateTray = (models: CompareModelItem[]) => {
    setSelectedModels(models);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
    } catch (e) {
      console.error("Failed to save compare tray to storage", e);
    }
  };

  const addModel = (model: CompareModelItem): boolean => {
    if (selectedModels.some((m) => m.slug === model.slug)) {
      return false; // Already in tray
    }
    if (selectedModels.length >= MAX_COMPARE_MODELS) {
      return false; // Tray is full
    }
    updateTray([...selectedModels, model]);
    return true;
  };

  const removeModel = (slug: string) => {
    updateTray(selectedModels.filter((m) => m.slug !== slug));
  };

  const clearTray = () => {
    updateTray([]);
  };

  const isInTray = (slug: string) => {
    return selectedModels.some((m) => m.slug === slug);
  };

  const navigateToCompare = () => {
    if (selectedModels.length >= 2) {
      const slugs = selectedModels.map((m) => m.slug).join(",");
      router.push(`/compare?models=${slugs}`);
    }
  };

  return (
    <CompareTrayContext.Provider
      value={{
        selectedModels,
        addModel,
        removeModel,
        clearTray,
        isInTray,
        canAdd: selectedModels.length < MAX_COMPARE_MODELS,
        navigateToCompare,
      }}
    >
      {children}
    </CompareTrayContext.Provider>
  );
}

export function useCompareTray() {
  const context = useContext(CompareTrayContext);
  if (!context) {
    throw new Error("useCompareTray must be used within a CompareTrayProvider");
  }
  return context;
}

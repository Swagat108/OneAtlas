"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./toast.context";

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
  const { toast } = useToast();

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
      toast({
        title: "Already in comparison",
        description: `${model.name} is already added to the comparison tray.`,
        variant: "info",
      });
      return false; // Already in tray
    }
    if (selectedModels.length >= MAX_COMPARE_MODELS) {
      toast({
        title: "Comparison tray full",
        description: "You can compare up to 4 models simultaneously. Remove one to add another.",
        variant: "destructive",
      });
      return false; // Tray is full
    }
    updateTray([...selectedModels, model]);
    toast({
      title: "Added to comparison",
      description: `${model.name} (${model.labName}) added (${selectedModels.length + 1}/${MAX_COMPARE_MODELS}).`,
      variant: "success",
    });
    return true;
  };

  const removeModel = (slug: string) => {
    const item = selectedModels.find((m) => m.slug === slug);
    updateTray(selectedModels.filter((m) => m.slug !== slug));
    if (item) {
      toast({
        title: "Removed from comparison",
        description: `${item.name} removed from comparison tray.`,
        variant: "default",
      });
    }
  };

  const clearTray = () => {
    updateTray([]);
    toast({
      title: "Comparison tray cleared",
      description: "All models have been removed.",
      variant: "default",
    });
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

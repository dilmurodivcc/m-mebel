"use client";

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

interface CategoryState {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  layout: 'grid' | 'list';
  setLayout: (layout: 'grid' | 'list') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  resetCategory: () => void;
}

export type { CategoryState };

export const useCategoryStore = create<CategoryState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        selectedCategory: '',
        setSelectedCategory: (category) => set({ selectedCategory: category }),
        selectedCategories: [],
        setSelectedCategories: (categories) => set({ selectedCategories: categories }),
        layout: 'grid', // Default value, will be overridden by persist
        setLayout: (layout) => set({ layout }),
        currentPage: 1,
        setCurrentPage: (page) => set({ currentPage: page }),
        resetCategory: () => set({ selectedCategory: '', selectedCategories: [], currentPage: 1 }),
      }),
      {
        name: 'category-store',
        partialize: (state) => ({
          layout: state.layout,
        }),
        // Skip hydration until client-side
        skipHydration: true,
      }
    )
  )
); 
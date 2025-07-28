"use client";

import { create } from 'zustand';

interface CategoryState {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  layout: 'grid' | 'list';
  setLayout: (layout: 'grid' | 'list') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export type { CategoryState };

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: '',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  layout: 'grid',
  setLayout: (layout) => set({ layout }),
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
})); 
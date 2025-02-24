'use client'

import { createContext, useContext, ReactNode } from 'react'
import { create } from 'zustand'

interface AppState {
  // Add your global state here
  loading: boolean
  setLoading: (loading: boolean) => void
}

const useStore = create<AppState>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}))

const StateContext = createContext<AppState | null>(null)

export function StateProvider({ children }: { children: ReactNode }) {
  return (
    <StateContext.Provider value={useStore()}>
      {children}
    </StateContext.Provider>
  )
}

export const useAppState = () => {
  const context = useContext(StateContext)
  if (!context) throw new Error('useAppState must be used within StateProvider')
  return context
}
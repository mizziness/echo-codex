import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Persona } from './personaTypes';
import { echoDaemon } from './personas/EchoDaemon';

// 👁️ Store definition
interface PersonaState {
  activePersona: Persona;
  setPersona: (persona: Persona) => void;
}

// 🏪 Create the store with Zustand and persist it
export const usePersonaStore = create(
  persist<PersonaState>(
    (set) => ({
      activePersona: echoDaemon,
      setPersona: (persona) => set({ activePersona: persona }),
    }),
    {
      name: 'persona-store',
    }
  )
);
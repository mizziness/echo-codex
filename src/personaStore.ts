import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PERSONAS } from './personaTypes';

// 👁️ Store definition
interface PersonaState {
  activePersona: typeof PERSONAS[keyof typeof PERSONAS];
  setPersona: (persona: typeof PERSONAS[keyof typeof PERSONAS]) => void;
}

// 🏪 Create the store with Zustand and persist it
export const usePersonaStore = create(
  persist<PersonaState>(
    (set) => ({
      activePersona: PERSONAS.ECHO_DAEMON,
      setPersona: (persona) => set({ activePersona: persona }),
    }),
    {
      name: 'persona-store',
    }
  )
);
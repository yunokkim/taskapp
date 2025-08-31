import { create } from 'zustand';
import { Persona } from '@/types';

interface PersonaState {
  personas: Persona[];
  loading: boolean;
  error: string | null;
  fetchPersonas: () => Promise<void>;
  addPersona: (persona: Omit<Persona, 'id'>) => Promise<void>;
  updatePersona: (id: string, updates: Partial<Omit<Persona, 'id'>>) => Promise<void>;
  deletePersona: (id: string) => Promise<void>;
  getPersonaById: (id: string) => Persona | undefined;
}

export const usePersonaStore = create<PersonaState>((set, get) => ({
  personas: [],
  loading: false,
  error: null,
  
  fetchPersonas: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/personas');
      if (!response.ok) {
        throw new Error('Failed to fetch personas');
      }
      const personas = await response.json();
      set({ personas, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  addPersona: async (persona) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/personas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(persona),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create persona');
      }
      
      const newPersona = await response.json();
      set(state => ({
        personas: [...state.personas, newPersona],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  updatePersona: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/personas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update persona');
      }
      
      const updatedPersona = await response.json();
      set(state => ({
        personas: state.personas.map(persona =>
          persona.id === id ? updatedPersona : persona
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  deletePersona: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/personas/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete persona');
      }
      
      set(state => ({
        personas: state.personas.filter(persona => persona.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getPersonaById: (id) => {
    return get().personas.find(persona => persona.id === id);
  }
}));
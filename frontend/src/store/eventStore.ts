import { create } from 'zustand';
import { Event, FilterOptions } from '@/types';

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: (filters?: FilterOptions) => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Omit<Event, 'id'>>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  getEventsByPersona: (personaId: string) => Event[];
  getEventsByDateRange: (startDate: Date, endDate: Date) => Event[];
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  loading: false,
  error: null,
  
  fetchEvents: async (filters) => {
    set({ loading: true, error: null });
    try {
      const searchParams = new URLSearchParams();
      
      if (filters?.personaIds?.length) {
        searchParams.set('personaIds', filters.personaIds.join(','));
      }
      if (filters?.startDate) {
        searchParams.set('startDate', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        searchParams.set('endDate', filters.endDate.toISOString());
      }
      if (filters?.searchText) {
        searchParams.set('searchText', filters.searchText);
      }
      if (filters?.tags?.length) {
        searchParams.set('tags', filters.tags.join(','));
      }

      const url = `/api/events${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const events = await response.json();
      // API 응답의 필드명을 프론트엔드 타입에 맞게 변환
      const transformedEvents = events.map((event: any) => ({
        ...event,
        personaId: event.persona_id,
        start: new Date(event.start), // ISO 문자열을 그대로 Date 객체로 변환 (UTC 유지)
        end: event.end ? new Date(event.end) : undefined,
        repeat: event.repeat.toLowerCase(),
        notifications: event.notification_settings?.map((notif: any) => ({
          type: notif.type.toLowerCase(),
          minutesBefore: notif.minutes_before,
        })) || [],
      }));
      
      set({ events: transformedEvents, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  addEvent: async (event) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          persona_id: event.personaId,
          repeat: (event.repeat || 'none').toUpperCase(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      const newEvent = await response.json();
      const transformedEvent = {
        ...newEvent,
        personaId: newEvent.persona_id,
        start: new Date(newEvent.start),
        end: newEvent.end ? new Date(newEvent.end) : undefined,
        repeat: newEvent.repeat.toLowerCase(),
        notifications: newEvent.notification_settings?.map((notif: any) => ({
          type: notif.type.toLowerCase(),
          minutesBefore: notif.minutes_before,
        })) || [],
      };
      
      set(state => ({
        events: [...state.events, transformedEvent],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  updateEvent: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updates,
          persona_id: updates.personaId,
          repeat: updates.repeat ? updates.repeat.toUpperCase() : undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      
      const updatedEvent = await response.json();
      const transformedEvent = {
        ...updatedEvent,
        personaId: updatedEvent.persona_id,
        start: new Date(updatedEvent.start),
        end: updatedEvent.end ? new Date(updatedEvent.end) : undefined,
        repeat: updatedEvent.repeat.toLowerCase(),
        notifications: updatedEvent.notification_settings?.map((notif: any) => ({
          type: notif.type.toLowerCase(),
          minutesBefore: notif.minutes_before,
        })) || [],
      };
      
      set(state => ({
        events: state.events.map(event =>
          event.id === id ? transformedEvent : event
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  deleteEvent: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      
      set(state => ({
        events: state.events.filter(event => event.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  getEventById: (id) => {
    return get().events.find(event => event.id === id);
  },
  
  getEventsByPersona: (personaId) => {
    return get().events.filter(event => event.personaId === personaId);
  },
  
  getEventsByDateRange: (startDate, endDate) => {
    const events = get().events;
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart >= startDate && eventStart <= endDate;
    });
  }
}));
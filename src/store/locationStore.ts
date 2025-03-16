import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Location, Equipment } from '../types';

interface LocationStore {
  locations: Location[];
  selectedLocation?: Location;
  addLocation: (name: string) => void;
  removeLocation: (id: string) => void;
  updateLocation: (location: Location) => void;
  addEquipment: (locationId: string, equipment: Equipment) => void;
  removeEquipment: (locationId: string, equipmentId: string) => void;
  selectLocation: (location?: Location) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      locations: [],
      selectedLocation: undefined,

      addLocation: (name: string) => {
        const newLocation: Location = {
          id: crypto.randomUUID(),
          name,
          equipment: []
        };
        set(state => ({
          locations: [...state.locations, newLocation]
        }));
      },

      removeLocation: (id: string) => {
        set(state => ({
          locations: state.locations.filter(loc => loc.id !== id),
          selectedLocation: state.selectedLocation?.id === id 
            ? undefined 
            : state.selectedLocation
        }));
      },

      updateLocation: (location: Location) => {
        set(state => ({
          locations: state.locations.map(loc => 
            loc.id === location.id ? location : loc
          ),
          selectedLocation: state.selectedLocation?.id === location.id
            ? location
            : state.selectedLocation
        }));
      },

      addEquipment: (locationId: string, equipment: Equipment) => {
        set(state => ({
          locations: state.locations.map(loc => 
            loc.id === locationId
              ? { ...loc, equipment: [...loc.equipment, equipment] }
              : loc
          )
        }));
      },

      removeEquipment: (locationId: string, equipmentId: string) => {
        set(state => ({
          locations: state.locations.map(loc => 
            loc.id === locationId
              ? { ...loc, equipment: loc.equipment.filter(eq => eq.id !== equipmentId) }
              : loc
          )
        }));
      },

      selectLocation: (location?: Location) => {
        set({ selectedLocation: location });
      }
    }),
    {
      name: 'workout-locations'
    }
  )
);

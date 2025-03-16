import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useLocationStore } from '../../store/locationStore';
import { Equipment } from '../../types';

export const LocationSettings: React.FC = () => {
  const { 
    locations,
    addLocation,
    removeLocation,
    addEquipment,
    removeEquipment
  } = useLocationStore();

  const [newLocationName, setNewLocationName] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);

  const handleAddLocation = () => {
    if (newLocationName.trim()) {
      addLocation(newLocationName.trim());
      setNewLocationName('');
    }
  };

  const handleAddEquipment = (locationId: string) => {
    if (newEquipment.trim()) {
      const equipment: Equipment = {
        id: crypto.randomUUID(),
        name: newEquipment.trim()
      };
      addEquipment(locationId, equipment);
      setNewEquipment('');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-3 dark:text-gray-200">Workout Locations</h3>

      {/* Add new location */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newLocationName}
          onChange={(e) => setNewLocationName(e.target.value)}
          placeholder="Add new location..."
          className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          onClick={handleAddLocation}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Location list */}
      <div className="space-y-4">
        {locations.map(location => (
          <div 
            key={location.id}
            className="border rounded-lg p-4 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium dark:text-white">{location.name}</h4>
              <button
                onClick={() => removeLocation(location.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Equipment list */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Equipment</h5>
              <div className="flex flex-wrap gap-2">
                {location.equipment.map(equipment => (
                  <div
                    key={equipment.id}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm dark:text-gray-200">{equipment.name}</span>
                    <button
                      onClick={() => removeEquipment(location.id, equipment.id)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add equipment */}
              {editingLocationId === location.id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="Add equipment..."
                    className="flex-1 px-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      handleAddEquipment(location.id);
                      setEditingLocationId(null);
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setEditingLocationId(null)}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingLocationId(location.id)}
                  className="text-blue-500 hover:text-blue-600 text-sm mt-2"
                >
                  + Add Equipment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

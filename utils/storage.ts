import AsyncStorage from '@react-native-async-storage/async-storage';
import { SoundMeasurement } from './soundMeter';
import { 
  CardiacMeasurement, 
  RespiratoryMeasurement,
  TremorMeasurement,
  GaitMeasurement,
  SpeechMeasurement
} from './biomedicalSensors';

const STORAGE_KEY = 'biosignal_measurements';

// Define a type for saved measurement that includes location and timestamp
export interface SavedMeasurement {
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  data: any; // Will hold the actual measurement data
}

// Save a new measurement to AsyncStorage
export const saveMeasurement = async (measurement: SavedMeasurement): Promise<SavedMeasurement[]> => {
  try {
    // Get existing measurements
    const existingMeasurementsJson = await AsyncStorage.getItem(STORAGE_KEY);
    const existingMeasurements: SavedMeasurement[] = existingMeasurementsJson 
      ? JSON.parse(existingMeasurementsJson) 
      : [];
    
    // Add new measurement
    const updatedMeasurements = [...existingMeasurements, measurement];
    
    // Save updated measurements
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMeasurements));
    
    return updatedMeasurements;
  } catch (error) {
    console.error('Error saving measurement:', error);
    throw error;
  }
};

// Get all saved measurements from AsyncStorage
export const getMeasurements = async (): Promise<SavedMeasurement[]> => {
  try {
    const measurementsJson = await AsyncStorage.getItem(STORAGE_KEY);
    return measurementsJson ? JSON.parse(measurementsJson) : [];
  } catch (error) {
    console.error('Error getting measurements:', error);
    throw error;
  }
};

// Clear all measurements from AsyncStorage
export const clearMeasurements = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing measurements:', error);
    throw error;
  }
};

// Filter measurements by minimum dB level
export const filterMeasurementsByMinDb = (
  measurements: SavedMeasurement[], 
  minDb: number
): SavedMeasurement[] => {
  return measurements.filter(measurement => 
    measurement.type === 'sound' && measurement.data.dB >= minDb
  );
};

// Filter measurements by date range
export const filterMeasurementsByDateRange = (
  measurements: SavedMeasurement[], 
  startDate: string | Date, 
  endDate: string | Date
): SavedMeasurement[] => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return measurements.filter(measurement => {
    const measurementTime = new Date(measurement.timestamp).getTime();
    return measurementTime >= start && measurementTime <= end;
  });
};

// Get the highest recorded measurement
export const getHighestMeasurement = (
  measurements: SavedMeasurement[]
): SavedMeasurement | null => {
  if (!measurements || measurements.length === 0) return null;
  
  // Filter to only sound measurements
  const soundMeasurements = measurements.filter(m => m.type === 'sound');
  
  if (soundMeasurements.length === 0) return null;
  
  return soundMeasurements.reduce((highest, current) => {
    return current.data.dB > highest.data.dB ? current : highest;
  }, soundMeasurements[0]);
};

// Group measurements by category
export const groupMeasurementsByCategory = (
  measurements: SavedMeasurement[]
): Record<string, SavedMeasurement[]> => {
  return measurements.reduce((grouped: Record<string, SavedMeasurement[]>, measurement) => {
    let categoryName = 'Unknown';
    
    if (measurement.type === 'sound' && measurement.data && measurement.data.category) {
      categoryName = measurement.data.category.description.split(' - ')[0];
    } else if (measurement.data && measurement.data.category) {
      categoryName = measurement.data.category.description;
    }
    
    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }
    
    grouped[categoryName].push(measurement);
    return grouped;
  }, {});
}; 
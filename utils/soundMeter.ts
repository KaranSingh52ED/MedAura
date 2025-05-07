import { Audio } from 'expo-av';
import { BiomedicalMonitoringMode } from './biomedicalSensors';

// Define types for sound level categories
export interface SoundLevel {
  max: number;
  description: string;
  color: string;
  action: string;
}

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface SoundMeasurement {
  dB: number;
  category: {
    level: string;
    description: string;
    color: string;
  }
}

// Sound levels in decibels and their descriptions
export const SOUND_LEVELS: Record<string, SoundLevel> = {
  NORMAL: {
    max: 70,
    description: 'Normal - Safe for hearing',
    color: '#4CAF50', // Green
    action: 'No action needed.'
  },
  MODERATE: {
    max: 85,
    description: 'Moderate - Extended exposure may cause damage',
    color: '#FFC107', // Amber
    action: 'Consider limiting exposure to less than 8 hours.'
  },
  HIGH: {
    max: 95,
    description: 'High - Damage possible with extended exposure',
    color: '#FF9800', // Orange
    action: 'Limit exposure to less than 1 hour. Consider ear protection.'
  },
  VERY_HIGH: {
    max: 110,
    description: 'Very High - Hearing damage likely',
    color: '#F44336', // Red
    action: 'Limit exposure to less than 15 minutes. Wear ear protection.'
  },
  DANGEROUS: {
    max: 999,
    description: 'Dangerous - Immediate hearing damage risk',
    color: '#9C27B0', // Purple
    action: 'Avoid exposure or use strong ear protection immediately.'
  }
};

// Convert audio recording amplitude to approximate dB value
// Note: This is a simplified approximation, real dB measurement requires calibration
export const amplitudeToDecibels = (amplitude: number): number => {
  // Normalize amplitude (typically between 0 and 1)
  const normalizedAmplitude = Math.min(Math.max(amplitude, 0), 1);
  
  // Convert to decibels (logarithmic scale)
  // 0 amplitude = 0 dB (silence)
  // 1 amplitude = 120 dB (very loud)
  // This is a simplified approximation
  return normalizedAmplitude * 120;
};

// Determine sound level category based on dB
export const getSoundLevelCategory = (dB: number): SoundLevel => {
  if (dB <= SOUND_LEVELS.NORMAL.max) return SOUND_LEVELS.NORMAL;
  if (dB <= SOUND_LEVELS.MODERATE.max) return SOUND_LEVELS.MODERATE;
  if (dB <= SOUND_LEVELS.HIGH.max) return SOUND_LEVELS.HIGH;
  if (dB <= SOUND_LEVELS.VERY_HIGH.max) return SOUND_LEVELS.VERY_HIGH;
  return SOUND_LEVELS.DANGEROUS;
};

// Determine confidence level based on measurement history and consistency
export const determineConfidenceLevel = (
  currentValue: number, 
  recentValues: number[]
): ConfidenceLevel => {
  if (recentValues.length < 3) return 'low';
  
  // Calculate standard deviation to measure variance
  const mean = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
  const squaredDifferences = recentValues.map(val => Math.pow(val - mean, 2));
  const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / recentValues.length;
  const stdDev = Math.sqrt(variance);
  
  // Determine confidence level based on standard deviation
  if (stdDev < 2) return 'high';
  if (stdDev < 5) return 'medium';
  return 'low';
};

// Track if we have an active recording 
let activeRecording: Audio.Recording | null = null;

// Export a function for biomedicalSensors to register the active sound recording
export const getActiveSoundRecording = (): Audio.Recording | null => {
  return activeRecording;
};

// Function to start the sound meter
export const startSoundMeter = async (
  onMeasurement: (measurement: SoundMeasurement) => void
): Promise<() => void> => {
  // Clean up any existing recording first
  if (activeRecording) {
    console.log("Cleaning up existing sound meter recording");
    try {
      await activeRecording.stopAndUnloadAsync();
    } catch (error) {
      console.error("Error stopping existing recording:", error);
    }
    activeRecording = null;
  }

  // Request audio permissions
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Microphone permission not granted');
  }

  try {
    // Set up audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      // Use numbers instead of constants to avoid type errors
      interruptionModeIOS: 1, // Do not mix with other audio
      interruptionModeAndroid: 1, // Do not mix with other audio
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // Create and prepare the recording
    const recording = new Audio.Recording();
    // Use Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY constant directly
    const recordingOptions = {
      android: {
        extension: '.m4a',
        outputFormat: 2, // MPEG_4
        audioEncoder: 3, // AAC
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
      ios: {
        extension: '.m4a',
        outputFormat: 1, // MPEG4AAC
        audioQuality: 2, // MAX
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {
        mimeType: 'audio/webm',
        bitsPerSecond: 128000,
      },
    };
    
    await recording.prepareToRecordAsync(recordingOptions);
    
    // Keep track of our active recording
    activeRecording = recording;
    
    // Set up the recording status callback
    recording.setOnRecordingStatusUpdate((status) => {
      if (!status.isRecording) return;
      
      // Extract metering data if available
      const dB = status.metering !== undefined ? status.metering : -160;
      
      // Create a measurement that matches the SoundMeasurement interface
      const measurement: SoundMeasurement = {
        dB: dB !== undefined ? dB : -160,
        category: getSoundCategory(dB !== undefined ? dB : -160)
      };
      
      // Send the measurement
      onMeasurement(measurement);
    });
    
    // Start the recording
    await recording.startAsync();
    
    // Return a cleanup function
    return async () => {
      console.log("Cleaning up sound meter recording");
      if (activeRecording) {
        try {
          await activeRecording.stopAndUnloadAsync();
          activeRecording = null;
        } catch (error) {
          console.error("Error stopping recording:", error);
        }
      }
    };
  } catch (error) {
    console.error("Error setting up sound meter:", error);
    throw error;
  }
};

// Helper function to categorize sound levels
const getSoundCategory = (dB: number): SoundMeasurement['category'] => {
  if (dB < 30) {
    return {
      level: 'Very Low',
      description: 'Quiet',
      color: '#4CAF50', // Green
    };
  } else if (dB < 50) {
    return {
      level: 'Low',
      description: 'Moderate',
      color: '#8BC34A', // Light Green
    };
  } else if (dB < 70) {
    return {
      level: 'Medium',
      description: 'Noticeable',
      color: '#FFEB3B', // Yellow
    };
  } else if (dB < 85) {
    return {
      level: 'High',
      description: 'Loud',
      color: '#FF9800', // Orange
    };
  } else {
    return {
      level: 'Very High',
      description: 'Dangerous',
      color: '#F44336', // Red
    };
  }
}; 
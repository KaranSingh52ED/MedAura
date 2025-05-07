import { Audio } from 'expo-av';
import { DeviceMotion } from 'expo-sensors';
import * as Camera from 'expo-camera';
import { Gyroscope } from 'expo-sensors';

// Biomedical monitoring types
export type BiomedicalMonitoringMode = 
  'none' |
  'sound' | 
  'cardiac' | 
  'respiratory' | 
  'tremor' | 
  'gait' | 
  'speech';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

// Base measurement interface
export interface BaseMeasurement {
  timestamp: number;
  confidenceLevel: ConfidenceLevel;
  rawValue: number;
}

// Cardiac measurement interface
export interface CardiacMeasurement extends BaseMeasurement {
  heartRate: number;
  category: HeartRateCategory;
}

// Respiratory measurement interface
export interface RespiratoryMeasurement extends BaseMeasurement {
  breathsPerMinute: number;
  category: RespiratoryRateCategory;
}

// Tremor measurement interface
export interface TremorMeasurement extends BaseMeasurement {
  intensity: number;
  frequency: number;
  category: TremorCategory;
}

// Gait measurement interface
export interface GaitMeasurement extends BaseMeasurement {
  stepsPerMinute: number;
  symmetry: number;
  stability: number;
  category: GaitCategory;
}

// Speech measurement interface
export interface SpeechMeasurement extends BaseMeasurement {
  clarity: number;
  volume: number;
  rhythm: number;
  category: SpeechCategory;
}

// Category interfaces
export interface CategoryBase {
  description: string;
  color: string;
  action: string;
}

export interface HeartRateCategory extends CategoryBase {}
export interface RespiratoryRateCategory extends CategoryBase {}
export interface TremorCategory extends CategoryBase {}
export interface GaitCategory extends CategoryBase {}
export interface SpeechCategory extends CategoryBase {}

// Heart rate categories
export const HEART_RATE_CATEGORIES: Record<string, HeartRateCategory> = {
  RESTING: {
    description: 'Resting Heart Rate',
    color: '#4CAF50', // Green
    action: 'Normal resting heart rate.'
  },
  LIGHT_ACTIVITY: {
    description: 'Light Activity Heart Rate',
    color: '#8BC34A', // Light Green
    action: 'Heart rate indicates light physical activity.'
  },
  MODERATE: {
    description: 'Moderate Activity Heart Rate',
    color: '#FFC107', // Amber
    action: 'Heart rate indicates moderate exertion.'
  },
  VIGOROUS: {
    description: 'Vigorous Activity Heart Rate',
    color: '#FF9800', // Orange
    action: 'Heart rate indicates vigorous exercise.'
  },
  ELEVATED: {
    description: 'Elevated Heart Rate',
    color: '#F44336', // Red
    action: 'Heart rate is elevated. Consider resting if not exercising.'
  }
};

// Respiratory rate categories
export const RESPIRATORY_CATEGORIES: Record<string, RespiratoryRateCategory> = {
  NORMAL: {
    description: 'Normal Breathing Rate',
    color: '#4CAF50', // Green
    action: 'Breathing rate is within normal range.'
  },
  ELEVATED: {
    description: 'Elevated Breathing Rate',
    color: '#FFC107', // Amber
    action: 'Breathing rate is slightly elevated.'
  },
  HIGH: {
    description: 'High Breathing Rate',
    color: '#FF9800', // Orange
    action: 'Breathing rate is high. Consider resting or breathing exercises.'
  },
  RAPID: {
    description: 'Rapid Breathing',
    color: '#F44336', // Red
    action: 'Breathing is rapid. If not exercising, consider medical attention.'
  }
};

// Tremor categories
export const TREMOR_CATEGORIES: Record<string, TremorCategory> = {
  MINIMAL: {
    description: 'Minimal Tremor',
    color: '#4CAF50', // Green
    action: 'Tremor levels are minimal.'
  },
  MILD: {
    description: 'Mild Tremor',
    color: '#FFC107', // Amber
    action: 'Mild tremor detected. Consider tracking over time.'
  },
  MODERATE: {
    description: 'Moderate Tremor',
    color: '#FF9800', // Orange
    action: 'Moderate tremor detected. Consider consulting a healthcare provider.'
  },
  SEVERE: {
    description: 'Severe Tremor',
    color: '#F44336', // Red
    action: 'Severe tremor detected. Recommend healthcare consultation.'
  }
};

// Gait categories
export const GAIT_CATEGORIES: Record<string, GaitCategory> = {
  NORMAL: {
    description: 'Normal Gait Pattern',
    color: '#4CAF50', // Green
    action: 'Walking pattern appears normal.'
  },
  MILD_ASYMMETRY: {
    description: 'Mild Gait Asymmetry',
    color: '#8BC34A', // Light Green
    action: 'Minor asymmetry in walking pattern detected.'
  },
  MODERATE_ASYMMETRY: {
    description: 'Moderate Gait Asymmetry',
    color: '#FFC107', // Amber
    action: 'Moderate asymmetry in walking pattern. Consider physical therapy consultation.'
  },
  UNSTABLE: {
    description: 'Unstable Gait',
    color: '#F44336', // Red
    action: 'Walking pattern shows significant instability. Consider medical evaluation.'
  }
};

// Speech categories
export const SPEECH_CATEGORIES: Record<string, SpeechCategory> = {
  CLEAR: {
    description: 'Clear Speech',
    color: '#4CAF50', // Green
    action: 'Speech pattern is clear and well-articulated.'
  },
  MINOR_ISSUES: {
    description: 'Minor Speech Issues',
    color: '#8BC34A', // Light Green
    action: 'Minor issues in speech clarity or rhythm detected.'
  },
  MODERATE_ISSUES: {
    description: 'Moderate Speech Issues',
    color: '#FFC107', // Amber
    action: 'Moderate issues in speech pattern. Consider speech exercises.'
  },
  SIGNIFICANT_ISSUES: {
    description: 'Significant Speech Issues',
    color: '#F44336', // Red
    action: 'Significant speech pattern issues detected. Consider speech therapy evaluation.'
  }
};

// Determine confidence level based on measurement history
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
  
  // Determine confidence level based on standard deviation relative to the mean
  const relativeStdDev = stdDev / Math.max(Math.abs(mean), 0.1);
  
  if (relativeStdDev < 0.05) return 'high';
  if (relativeStdDev < 0.15) return 'medium';
  return 'low';
};

// Track the active monitoring instances
let activeCardiacMonitor: NodeJS.Timeout | null = null;
let activeRespiratoryRecording: Audio.Recording | null = null;
let activeSpeechRecording: Audio.Recording | null = null;

// Cardiac rhythm monitoring (using camera PPG)
export const startCardiacMonitor = async (
  onMeasurement: (measurement: CardiacMeasurement) => void
): Promise<() => void> => {
  // Clean up any existing recordings first
  await cleanupAllAudioRecordings();
  
  // Request camera permissions which are used for heart rate monitoring
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Camera permission not granted');
  }
  
  try {
    let measuring = true;
    let lastReading = 0;
    
    // Simulated heart rate measurement function
    const measureHeartRate = () => {
      // Base heart rate value (simulated)
      const baseHeartRate = 72;
      
      // Add some random variation
      const variation = Math.random() * 10 - 5;
      const heartRate = Math.round(baseHeartRate + variation);
      
      // Don't update if we stopped measuring
      if (!measuring) return;
      
      const currentTime = Date.now();
      
      // Get heart rate category based on the measurement
      let category: HeartRateCategory;
      if (heartRate < 60) category = HEART_RATE_CATEGORIES.RESTING;
      else if (heartRate < 100) category = HEART_RATE_CATEGORIES.LIGHT_ACTIVITY;
      else if (heartRate < 140) category = HEART_RATE_CATEGORIES.MODERATE;
      else if (heartRate < 170) category = HEART_RATE_CATEGORIES.VIGOROUS;
      else category = HEART_RATE_CATEGORIES.ELEVATED;
      
      // Create measurement object
      const measurement: CardiacMeasurement = {
        heartRate,
        timestamp: currentTime,
        confidenceLevel: 'high',
        rawValue: heartRate,
        category: category
      };
      
      // Update last reading time
      lastReading = currentTime;
      
      // Send measurement to callback
      onMeasurement(measurement);
    };
    
    // Start measuring heart rate at intervals
    const intervalId = setInterval(measureHeartRate, 1000);
    
    // Call once immediately to get initial reading
    measureHeartRate();
    
    // Return cleanup function
    return () => {
      measuring = false;
      clearInterval(intervalId);
    };
  } catch (error) {
    console.error('Error starting cardiac monitor:', error);
    throw error;
  }
};

// Respiratory rate monitoring (using microphone)
export const startRespiratoryMonitor = async (
  onMeasurement: (measurement: RespiratoryMeasurement) => void
): Promise<() => void> => {
  // Clean up any existing respiratory recording
  if (activeRespiratoryRecording) {
    console.log('Stopping previous respiratory recording session...');
    try {
      await activeRespiratoryRecording.stopAndUnloadAsync();
    } catch (error) {
      console.log('Error stopping previous respiratory recording:', error);
    }
    activeRespiratoryRecording = null;
  }

  // Request audio permissions
  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permission to access microphone is required');
  }
  
  // Set up audio recording
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });
  
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await recording.startAsync();
  activeRespiratoryRecording = recording;
  
  let isMeasuring = true;
  const recentValues: number[] = [];
  const MAX_HISTORY = 10;
  
  // Set up measurement interval
  const measurementInterval = setInterval(async () => {
    if (!isMeasuring) return;
    
    try {
      const status = await recording.getStatusAsync();
      
      if (status.isRecording && status.metering !== undefined) {
        // In a real implementation, you would analyze breathing patterns from audio
        // Here we're simulating breathing detection
        const rawValue = status.metering;
        
        recentValues.push(rawValue);
        if (recentValues.length > MAX_HISTORY) {
          recentValues.shift();
        }
        
        // Simulate respiratory rate (normal adult is 12-20 breaths per minute)
        const baseRate = 14; // Base breaths per minute
        const variation = Math.sin(Date.now() / 5000) * 3; // Slow variation
        const noise = (Math.random() - 0.5) * 2; // Random noise
        const breathsPerMinute = baseRate + variation + noise;
        
        // Determine category
        let category: RespiratoryRateCategory;
        if (breathsPerMinute < 12) category = RESPIRATORY_CATEGORIES.NORMAL;
        else if (breathsPerMinute < 20) category = RESPIRATORY_CATEGORIES.NORMAL;
        else if (breathsPerMinute < 30) category = RESPIRATORY_CATEGORIES.ELEVATED;
        else if (breathsPerMinute < 40) category = RESPIRATORY_CATEGORIES.HIGH;
        else category = RESPIRATORY_CATEGORIES.RAPID;
        
        // Calculate confidence level
        const confidenceLevel = determineConfidenceLevel(rawValue, recentValues);
        
        // Send measurement
        onMeasurement({
          breathsPerMinute: Math.round(breathsPerMinute * 10) / 10,
          category,
          confidenceLevel,
          rawValue,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error measuring respiratory rate:', error);
    }
  }, 1000);
  
  // Return function to stop measuring
  return () => {
    isMeasuring = false;
    clearInterval(measurementInterval);
    if (activeRespiratoryRecording === recording) {
      recording.stopAndUnloadAsync().then(() => {
        activeRespiratoryRecording = null;
      }).catch(error => {
        console.error('Error stopping respiratory recording:', error);
        activeRespiratoryRecording = null;
      });
    }
  };
};

// Tremor monitoring (using accelerometer)
export const startTremorMonitor = async (
  onMeasurement: (measurement: TremorMeasurement) => void
): Promise<() => void> => {
  DeviceMotion.setUpdateInterval(100); // 10 Hz sampling rate
  
  let isMeasuring = true;
  const recentValues: number[] = [];
  const MAX_HISTORY = 50; // 5 seconds of data at 10Hz
  
  // Subscribe to accelerometer updates
  const subscription = DeviceMotion.addListener(data => {
    if (!isMeasuring) return;
    
    // Calculate magnitude of acceleration
    const { x, y, z } = data.acceleration;
    const magnitude = Math.sqrt(x*x + y*y + z*z);
    
    recentValues.push(magnitude);
    if (recentValues.length > MAX_HISTORY) {
      recentValues.shift();
    }
    
    if (recentValues.length >= 20) { // Need enough samples for analysis
      // In a real implementation, would do frequency analysis
      // Here we're simulating tremor analysis
      
      // Calculate variation (simulated tremor intensity)
      const mean = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
      const differences = recentValues.map(val => Math.abs(val - mean));
      const avgDeviation = differences.reduce((sum, val) => sum + val, 0) / differences.length;
      
      // Simulate frequency (typically 4-12 Hz for pathological tremors)
      // For demo purposes only - real implementation would use FFT
      const baseFrequency = 5; // Base frequency in Hz
      const freqNoise = Math.random() * 2; // Random variation
      const frequency = baseFrequency + freqNoise;
      
      // Determine category based on intensity
      let category: TremorCategory;
      if (avgDeviation < 0.02) category = TREMOR_CATEGORIES.MINIMAL;
      else if (avgDeviation < 0.05) category = TREMOR_CATEGORIES.MILD;
      else if (avgDeviation < 0.1) category = TREMOR_CATEGORIES.MODERATE;
      else category = TREMOR_CATEGORIES.SEVERE;
      
      // Calculate confidence level
      const confidenceLevel = determineConfidenceLevel(magnitude, recentValues.slice(-10));
      
      // Send measurement
      onMeasurement({
        intensity: avgDeviation,
        frequency,
        category,
        confidenceLevel,
        rawValue: magnitude,
        timestamp: Date.now()
      });
    }
  });
  
  // Return function to stop measuring
  return () => {
    isMeasuring = false;
    subscription.remove();
  };
};

// Gait analysis monitoring
export const startGaitMonitor = async (
  onMeasurement: (measurement: GaitMeasurement) => void
): Promise<() => void> => {
  DeviceMotion.setUpdateInterval(50); // 20 Hz sampling rate
  
  let isMeasuring = true;
  const accelerationValues: {x: number, y: number, z: number, timestamp: number}[] = [];
  const MAX_HISTORY = 100; // 5 seconds of data at 20Hz
  
  // For step detection
  let lastPeak = 0;
  let stepTimestamps: number[] = [];
  const MAX_STEP_HISTORY = 10;
  
  // Subscribe to accelerometer updates
  const subscription = DeviceMotion.addListener(data => {
    if (!isMeasuring) return;
    
    const { x, y, z } = data.acceleration;
    const timestamp = Date.now();
    
    accelerationValues.push({x, y, z, timestamp});
    if (accelerationValues.length > MAX_HISTORY) {
      accelerationValues.shift();
    }
    
    // Very simple step detection based on vertical acceleration peaks
    // In a real app, would use more sophisticated algorithms
    if (accelerationValues.length >= 20) { // Need enough samples for analysis
      // Detect steps by looking for peaks in vertical acceleration
      const verticalAccel = y; // Assuming phone is in pocket with y-axis vertical
      
      // Simple peak detection
      if (verticalAccel > 0.5 && lastPeak < 0) { // Threshold crossing
        const currentTime = timestamp;
        if (stepTimestamps.length > 0) {
          const lastStepTime = stepTimestamps[stepTimestamps.length - 1];
          // Only count if it's been at least 250ms since last step (debounce)
          if (currentTime - lastStepTime > 250) {
            stepTimestamps.push(currentTime);
            if (stepTimestamps.length > MAX_STEP_HISTORY) {
              stepTimestamps.shift();
            }
          }
        } else {
          stepTimestamps.push(currentTime);
        }
      }
      lastPeak = verticalAccel;
      
      // Calculate cadence (steps per minute)
      let stepsPerMinute = 0;
      if (stepTimestamps.length >= 2) {
        const timeSpan = (stepTimestamps[stepTimestamps.length - 1] - stepTimestamps[0]) / 1000; // in seconds
        const steps = stepTimestamps.length - 1;
        stepsPerMinute = (steps / timeSpan) * 60;
      }
      
      // Calculate symmetry (simulated - would use left/right step analysis in real app)
      // Range: 0 (completely asymmetric) to 1 (perfect symmetry)
      const baseSymmetry = 0.8; // Base symmetry value
      const symmetryNoise = Math.random() * 0.2; // Random noise
      const symmetry = baseSymmetry + symmetryNoise;
      
      // Calculate stability (simulated - would analyze acceleration variance)
      // Range: 0 (unstable) to 1 (very stable)
      const varianceX = calculateVariance(accelerationValues.map(v => v.x));
      const varianceZ = calculateVariance(accelerationValues.map(v => v.z));
      const totalVariance = varianceX + varianceZ;
      const stability = Math.max(0, Math.min(1, 1 - totalVariance));
      
      // Determine category based on symmetry and stability
      let category: GaitCategory;
      const combinedScore = (symmetry + stability) / 2;
      
      if (combinedScore > 0.85) category = GAIT_CATEGORIES.NORMAL;
      else if (combinedScore > 0.7) category = GAIT_CATEGORIES.MILD_ASYMMETRY;
      else if (combinedScore > 0.5) category = GAIT_CATEGORIES.MODERATE_ASYMMETRY;
      else category = GAIT_CATEGORIES.UNSTABLE;
      
      // Calculate confidence level using y-axis values
      const yValues = accelerationValues.slice(-10).map(v => v.y);
      const confidenceLevel = determineConfidenceLevel(y, yValues);
      
      // Send measurement
      onMeasurement({
        stepsPerMinute,
        symmetry,
        stability,
        category,
        confidenceLevel,
        rawValue: y, // Using vertical acceleration as raw value
        timestamp
      });
    }
  });
  
  // Return function to stop measuring
  return () => {
    isMeasuring = false;
    subscription.remove();
  };
};

// Speech analysis monitoring
export const startSpeechMonitor = async (
  onMeasurement: (measurement: SpeechMeasurement) => void
): Promise<() => void> => {
  // Clean up any existing speech recording
  if (activeSpeechRecording) {
    console.log('Stopping previous speech recording session...');
    try {
      await activeSpeechRecording.stopAndUnloadAsync();
    } catch (error) {
      console.log('Error stopping previous speech recording:', error);
    }
    activeSpeechRecording = null;
  }

  // Request audio permissions
  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permission to access microphone is required');
  }
  
  // Set up audio recording
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });
  
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await recording.startAsync();
  activeSpeechRecording = recording;
  
  let isMeasuring = true;
  const audioValues: number[] = [];
  const MAX_HISTORY = 50; // Keep 5 seconds at 10 Hz
  const ANALYSIS_INTERVAL = 500; // Analyze every 500ms
  
  // Set up measurement interval
  const measurementInterval = setInterval(async () => {
    if (!isMeasuring) return;
    
    try {
      const status = await recording.getStatusAsync();
      
      if (status.isRecording && status.metering !== undefined) {
        // Get audio level
        const audioLevel = status.metering;
        audioValues.push(audioLevel);
        if (audioValues.length > MAX_HISTORY) {
          audioValues.shift();
        }
        
        // In a real implementation, speech analysis would include:
        // - Frequency analysis for pitch variation
        // - Speech rate detection
        // - Clarity/articulation metrics
        
        // For this demo, simulating speech analysis metrics
        // Clarity: How clear/articulate speech is (0-1)
        const baseClarity = 0.75;
        const clarityNoise = Math.random() * 0.2;
        const clarity = baseClarity + clarityNoise;
        
        // Volume: Loudness normalized (0-1)
        const rawVolume = Math.min(Math.max((audioLevel + 100) / 60, 0), 1);
        const volume = rawVolume * 0.8 + Math.random() * 0.2;
        
        // Rhythm: Consistency of speech patterns (0-1)
        const baseRhythm = 0.7;
        const rhythmNoise = Math.random() * 0.3;
        const rhythm = baseRhythm + rhythmNoise;
        
        // Calculate overall score (0-1)
        const overallScore = (clarity * 0.5) + (volume * 0.2) + (rhythm * 0.3);
        
        // Determine category based on overall score
        let category: SpeechCategory;
        if (overallScore > 0.8) category = SPEECH_CATEGORIES.CLEAR;
        else if (overallScore > 0.65) category = SPEECH_CATEGORIES.MINOR_ISSUES;
        else if (overallScore > 0.5) category = SPEECH_CATEGORIES.MODERATE_ISSUES;
        else category = SPEECH_CATEGORIES.SIGNIFICANT_ISSUES;
        
        // Calculate confidence level
        const confidenceLevel = determineConfidenceLevel(audioLevel, audioValues.slice(-10));
        
        // Send measurement
        onMeasurement({
          clarity,
          volume,
          rhythm,
          category,
          confidenceLevel,
          rawValue: audioLevel,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error analyzing speech:', error);
    }
  }, ANALYSIS_INTERVAL);
  
  // Return function to stop measuring
  return () => {
    isMeasuring = false;
    clearInterval(measurementInterval);
    if (activeSpeechRecording === recording) {
      recording.stopAndUnloadAsync().then(() => {
        activeSpeechRecording = null;
      }).catch(error => {
        console.error('Error stopping speech recording:', error);
        activeSpeechRecording = null;
      });
    }
  };
};

// Helper functions
function calculateVariance(values: number[]): number {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
}

// Add function to clean up all active audio recordings
export const cleanupAllAudioRecordings = async (): Promise<void> => {
  // Clean up sound recording by using the exported function from soundMeter
  try {
    // We'll directly use the API of the sound module
    // Since there's no direct way to access the activeRecording from soundMeter,
    // we'll rely on our implementation cleanup approach
    console.log('Checking for any active sound recordings to clean up...');
    // The cleanup will be handled when each module is reinitialized
  } catch (error) {
    console.error('Error during sound recording cleanup:', error);
  }
  
  // Clean up respiratory recording
  if (activeRespiratoryRecording) {
    try {
      console.log('Cleaning up respiratory recording...');
      await activeRespiratoryRecording.stopAndUnloadAsync();
    } catch (error) {
      console.error('Error cleaning up respiratory recording:', error);
    }
    activeRespiratoryRecording = null;
  }
  
  // Clean up speech recording
  if (activeSpeechRecording) {
    try {
      console.log('Cleaning up speech recording...');
      await activeSpeechRecording.stopAndUnloadAsync();
    } catch (error) {
      console.error('Error cleaning up speech recording:', error);
    }
    activeSpeechRecording = null;
  }
  
  // Clean up cardiac monitor
  if (activeCardiacMonitor) {
    console.log('Cleaning up cardiac monitor...');
    clearInterval(activeCardiacMonitor);
    activeCardiacMonitor = null;
  }
}; 
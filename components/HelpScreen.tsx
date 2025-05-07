import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HelpScreenProps {
  onClose: () => void;
  currentMode?: 'sound' | 'heart' | 'breathing' | 'tremor' | 'gait' | 'speech' | 'general';
}

export default function HelpScreen({ onClose, currentMode = 'general' }: HelpScreenProps) {
  const helpContent = {
    general: {
      title: 'BioSignal Monitor: Quick Start Guide',
      content: [
        {
          subtitle: 'Welcome to BioSignal Monitor',
          steps: [
            'Navigate between different monitoring modes using the buttons on the dashboard',
            'Save your measurements to track changes over time',
            'Access your saved data via the History tab',
            'Configure your preferences in the Settings menu'
          ]
        }
      ]
    },
    sound: {
      title: 'How to Use Sound Pollution Detector',
      content: [
        {
          subtitle: 'Measuring Sound Levels',
          steps: [
            'Make sure you are in a stable position',
            'The app automatically measures ambient sound levels',
            'Observe the decibel (dB) readings on screen',
            'Note the color-coded indicator for severity level',
            'Tap "Save" to record the measurement with location'
          ]
        },
        {
          subtitle: 'Understanding Results',
          steps: [
            'Green (0-70 dB): Safe for hearing',
            'Yellow (71-85 dB): Limit exposure to 8 hours',
            'Orange (86-95 dB): Limit exposure to 1 hour',
            'Red (96-110 dB): Limit exposure to 15 minutes',
            'Purple (111+ dB): Avoid exposure or use protection'
          ]
        }
      ]
    },
    heart: {
      title: 'How to Use Heart Rate Monitor',
      content: [
        {
          subtitle: 'Measuring Heart Rate',
          steps: [
            'Place your fingertip gently over the camera lens',
            'Ensure your finger completely covers the lens and flash',
            'Hold still for 30-45 seconds during measurement',
            'The app will detect blood flow changes to calculate BPM',
            'Tap "Save" to record your heart rate'
          ]
        },
        {
          subtitle: 'For Best Results',
          steps: [
            'Ensure good lighting conditions',
            'Apply gentle pressure - not too hard, not too soft',
            'Remain still throughout the entire measurement',
            'Take multiple readings for better accuracy',
            'Measure when relaxed for your resting heart rate'
          ]
        }
      ]
    },
    breathing: {
      title: 'How to Use Respiratory Rate Monitor',
      content: [
        {
          subtitle: 'Measuring Breathing Rate',
          steps: [
            'Position the device near your mouth or on a surface',
            'Breathe normally for the entire 30-second period',
            'The app will detect sound patterns to count breaths',
            'Your breathing rate will be displayed in breaths/minute',
            'Tap "Save" to record your respiratory rate'
          ]
        },
        {
          subtitle: 'For Best Results',
          steps: [
            'Find a quiet environment with minimal background noise',
            'Maintain a consistent breathing pattern',
            'Avoid talking during measurement',
            'Take measurements both at rest and after activity',
            'Measure at different times of day for comparison'
          ]
        }
      ]
    },
    tremor: {
      title: 'How to Use Tremor Assessment',
      content: [
        {
          subtitle: 'Measuring Tremor',
          steps: [
            'Hold the phone with your arm extended in front of you',
            'Press "Start" to begin the 15-second assessment',
            'Try to hold your arm as steady as possible',
            'The app will use the accelerometer to detect movements',
            'Tap "Save" to record your tremor assessment'
          ]
        },
        {
          subtitle: 'Understanding Results',
          steps: [
            'Frequency: How fast the tremor oscillates',
            'Amplitude: How large the movements are',
            'Regularity: How consistent the pattern is',
            'Compare results over time to track changes',
            'Consider taking measurements at different times of day'
          ]
        }
      ]
    },
    gait: {
      title: 'How to Use Gait Analysis',
      content: [
        {
          subtitle: 'Analyzing Your Walking Pattern',
          steps: [
            'Secure the phone in your pocket or at your waist',
            'Press "Start" to begin the analysis',
            'Walk naturally for about 20 steps',
            'Press "Stop" when you have completed walking',
            'Tap "Save" to record your gait analysis'
          ]
        },
        {
          subtitle: 'Understanding Results',
          steps: [
            'Step Rate: Number of steps per minute',
            'Symmetry: Balance between left and right steps',
            'Stability: Consistency of your walking pattern',
            'Impact Force: How hard your feet strike the ground',
            'Stride Length: Estimated distance between steps'
          ]
        }
      ]
    },
    speech: {
      title: 'How to Use Speech Analysis',
      content: [
        {
          subtitle: 'Analyzing Your Speech',
          steps: [
            'Find a quiet environment with minimal background noise',
            'Press "Start" to begin recording',
            'Read the provided text or speak naturally',
            'Press "Stop" when you have finished speaking',
            'Tap "Save" to record your speech analysis'
          ]
        },
        {
          subtitle: 'Understanding Results',
          steps: [
            'Clarity: How distinct your speech sounds are',
            'Volume: Consistency of your speaking volume',
            'Rhythm: Pattern and timing of your speech',
            'Pace: How quickly you speak (words per minute)',
            'Compare results over time to track changes'
          ]
        }
      ]
    }
  };

  const activeHelp = currentMode === 'general' ? helpContent.general : helpContent[currentMode];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{activeHelp.title}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {activeHelp.content.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subtitle}>{section.subtitle}</Text>
            {section.steps.map((step, stepIndex) => (
              <View key={stepIndex} style={styles.stepContainer}>
                <Ionicons name="checkmark-circle" size={22} color="#2196F3" />
                <Text style={styles.step}>{step}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            For more detailed instructions, please check the documentation or contact support.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  step: {
    fontSize: 15,
    color: '#444',
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    marginTop: 20,
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f0f7ff',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  footerText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  }
}); 
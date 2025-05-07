import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Dimensions 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { BiomedicalMonitoringMode } from '../utils/biomedicalSensors';

interface VideoTutorialProps {
  mode: BiomedicalMonitoringMode;
  style?: any;
}

export default function VideoTutorial({ mode, style }: VideoTutorialProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const videoRef = useRef<Video>(null);

  const tutorialVideos: Record<BiomedicalMonitoringMode, { title: string, videoUri: string }> = {
    sound: {
      title: 'How to Measure Sound Pollution',
      // In a real app, you would have actual tutorial videos for each feature
      videoUri: 'https://example.com/videos/sound-tutorial.mp4'
    },
    cardiac: {
      title: 'How to Measure Heart Rate',
      videoUri: 'https://example.com/videos/cardiac-tutorial.mp4'
    },
    respiratory: {
      title: 'How to Measure Respiratory Rate',
      videoUri: 'https://example.com/videos/respiratory-tutorial.mp4'
    },
    tremor: {
      title: 'How to Assess Tremor',
      videoUri: 'https://example.com/videos/tremor-tutorial.mp4'
    },
    gait: {
      title: 'How to Analyze Your Gait',
      videoUri: 'https://example.com/videos/gait-tutorial.mp4'
    },
    speech: {
      title: 'How to Analyze Your Speech',
      videoUri: 'https://example.com/videos/speech-tutorial.mp4'
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.button, style]} 
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Video Tutorial"
        accessibilityHint={`Opens video tutorial for ${tutorialVideos[mode].title}`}
      >
        <Ionicons name="videocam" size={22} color="#2196F3" />
        <Text style={styles.buttonText}>Watch Tutorial</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{tutorialVideos[mode].title}</Text>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  if (videoRef.current) {
                    videoRef.current.pauseAsync();
                  }
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <Video
              ref={videoRef}
              style={styles.video}
              source={{ uri: tutorialVideos[mode].videoUri }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              onError={(error) => console.error('Video loading error:', error)}
            />
            
            <Text style={styles.tutorialNote}>
              This tutorial shows step-by-step instructions for using the {tutorialVideos[mode].title} feature.
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  video: {
    height: width * 0.5,
    backgroundColor: '#000',
  },
  tutorialNote: {
    padding: 16,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  }
}); 
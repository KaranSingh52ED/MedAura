import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HelpScreen from './HelpScreen';

// Import the monitoring mode type from utils
import { BiomedicalMonitoringMode } from '../utils/biomedicalSensors';

interface HelpButtonProps {
  currentMode?: BiomedicalMonitoringMode | 'general';
  style?: any;
  onPress?: () => void;
}

export default function HelpButton({ currentMode = 'general', style, onPress }: HelpButtonProps) {
  const [showHelp, setShowHelp] = useState(false);

  // Map biomedical monitoring modes to help screen modes
  const mapModeToHelpMode = (mode: BiomedicalMonitoringMode | 'general') => {
    if (mode === 'general') return 'general';
    if (mode === 'cardiac') return 'heart';
    if (mode === 'respiratory') return 'breathing';
    if (mode === 'tremor') return 'tremor';
    if (mode === 'gait') return 'gait';
    if (mode === 'speech') return 'speech';
    return 'sound'; // Default to sound mode help
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      setShowHelp(true);
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.helpButton, style]} 
        onPress={handlePress}
        accessibilityLabel="Help"
        accessibilityHint="Opens the help screen with usage instructions"
      >
        <Ionicons name="help-circle" size={28} color="#2196F3" />
      </TouchableOpacity>

      <Modal
        visible={showHelp}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowHelp(false)}
      >
        <HelpScreen 
          onClose={() => setShowHelp(false)} 
          currentMode={mapModeToHelpMode(currentMode)}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  helpButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
}); 
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SOUND_LEVELS, SoundMeasurement, ConfidenceLevel } from '../utils/soundMeter';

interface SoundMeterProps {
  measurement: SoundMeasurement | null;
}

const SoundMeter: React.FC<SoundMeterProps> = ({ measurement }) => {
  const [showAccuracyInfo, setShowAccuracyInfo] = React.useState(false);

  if (!measurement) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Initializing sound meter...</Text>
      </View>
    );
  }

  const { dB, category, confidenceLevel = 'medium' } = measurement;
  
  // Calculate meter fill percentage
  const maxDB = 120; // Maximum dB value we're displaying
  const fillPercentage = Math.min((dB / maxDB) * 100, 100);

  // Get confidence level icon and text
  const getConfidenceLevelInfo = (confidenceLevel?: ConfidenceLevel) => {
    if (!confidenceLevel) {
      return { icon: 'help-circle-outline', color: '#9E9E9E', text: 'Unknown confidence' };
    }
    
    switch (confidenceLevel) {
      case 'high':
        return { icon: 'shield-checkmark-outline', color: '#4CAF50', text: 'High confidence' };
      case 'medium':
        return { icon: 'shield-outline', color: '#FFC107', text: 'Medium confidence' };
      case 'low':
        return { icon: 'shield-outline', color: '#F44336', text: 'Low confidence' };
      default:
        return { icon: 'shield-outline', color: '#FFC107', text: 'Medium confidence' };
    }
  };

  const confidenceInfo = getConfidenceLevelInfo(confidenceLevel);
  
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Current Sound Level</Text>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => setShowAccuracyInfo(!showAccuracyInfo)}
        >
          <Ionicons 
            name="information-circle-outline" 
            size={22} 
            color="#777" 
          />
        </TouchableOpacity>
      </View>
      
      {/* Accuracy Disclaimer */}
      {showAccuracyInfo && (
        <View style={styles.accuracyDisclaimerContainer}>
          <Text style={styles.accuracyDisclaimerTitle}>Measurement Accuracy</Text>
          <Text style={styles.accuracyDisclaimerText}>
            Mobile devices provide approximate sound measurements. Different devices may show different readings.
          </Text>
          <Text style={styles.accuracyDisclaimerText}>
            For professional sound level measurements, use a calibrated sound level meter.
          </Text>
        </View>
      )}

      {/* Confidence Level Indicator */}
      <View style={[styles.confidenceLevelContainer, { borderColor: confidenceInfo.color }]}>
        <Ionicons name={confidenceInfo.icon as any} size={16} color={confidenceInfo.color} />
        <Text style={[styles.confidenceLevelText, { color: confidenceInfo.color }]}>
          {confidenceInfo.text}
        </Text>
      </View>
      
      <View style={styles.meterContainer}>
        <View style={styles.meterBackground}>
          {/* Colored sections for different sound levels */}
          <View 
            style={[
              styles.meterSection, 
              { backgroundColor: SOUND_LEVELS.NORMAL.color, flex: SOUND_LEVELS.NORMAL.max / maxDB }
            ]} 
          />
          <View 
            style={[
              styles.meterSection, 
              { backgroundColor: SOUND_LEVELS.MODERATE.color, flex: (SOUND_LEVELS.MODERATE.max - SOUND_LEVELS.NORMAL.max) / maxDB }
            ]} 
          />
          <View 
            style={[
              styles.meterSection, 
              { backgroundColor: SOUND_LEVELS.HIGH.color, flex: (SOUND_LEVELS.HIGH.max - SOUND_LEVELS.MODERATE.max) / maxDB }
            ]} 
          />
          <View 
            style={[
              styles.meterSection, 
              { backgroundColor: SOUND_LEVELS.VERY_HIGH.color, flex: (SOUND_LEVELS.VERY_HIGH.max - SOUND_LEVELS.HIGH.max) / maxDB }
            ]} 
          />
          <View 
            style={[
              styles.meterSection, 
              { backgroundColor: SOUND_LEVELS.DANGEROUS.color, flex: (maxDB - SOUND_LEVELS.VERY_HIGH.max) / maxDB }
            ]} 
          />
        </View>
        
        {/* Meter fill */}
        <View 
          style={[
            styles.meterFill, 
            { width: `${fillPercentage}%`, backgroundColor: category.color }
          ]} 
        />
        
        {/* Indicator */}
        <View style={[styles.indicator, { left: `${fillPercentage}%` }]} />
      </View>
      
      {/* Display the dB value */}
      <Text style={styles.dbValue}>{dB.toFixed(1)} dB</Text>
      
      {/* Display the category and description */}
      <View style={[styles.categoryContainer, { backgroundColor: category.color }]}>
        <Text style={styles.categoryText}>{category.description}</Text>
      </View>
      
      {/* Action recommendation */}
      <View style={styles.actionContainer}>
        <Text style={styles.actionTitle}>Recommended Action:</Text>
        <Text style={styles.actionText}>{category.action}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoButton: {
    marginLeft: 8,
    padding: 4,
  },
  accuracyDisclaimerContainer: {
    backgroundColor: '#f8f4ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  accuracyDisclaimerTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  accuracyDisclaimerText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
  confidenceLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 16,
    borderStyle: 'dashed',
    alignSelf: 'center',
  },
  confidenceLevelText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  meterContainer: {
    position: 'relative',
    height: 40,
    marginBottom: 8,
  },
  meterBackground: {
    flexDirection: 'row',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  meterSection: {
    height: '100%',
  },
  meterFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: 20,
  },
  indicator: {
    position: 'absolute',
    top: -5,
    marginLeft: -8,
    width: 16,
    height: 50,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  dbValue: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  categoryContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  actionContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  actionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionText: {
    fontSize: 14,
  },
});

export default SoundMeter; 
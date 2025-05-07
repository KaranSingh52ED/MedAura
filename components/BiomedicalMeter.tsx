import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SoundMeasurement } from '../utils/soundMeter';
import { 
  CardiacMeasurement, 
  RespiratoryMeasurement,
  TremorMeasurement,
  GaitMeasurement,
  SpeechMeasurement,
  ConfidenceLevel
} from '../utils/biomedicalSensors';
import { Colors } from '../constants/Colors';

// Union type for all possible measurement types
type MeasurementType = 
  | { type: 'sound'; data: SoundMeasurement | null }
  | { type: 'cardiac'; data: CardiacMeasurement | null }
  | { type: 'respiratory'; data: RespiratoryMeasurement | null }
  | { type: 'tremor'; data: TremorMeasurement | null }
  | { type: 'gait'; data: GaitMeasurement | null }
  | { type: 'speech'; data: SpeechMeasurement | null };

interface BiomedicalMeterProps {
  measurement: MeasurementType;
}

const BiomedicalMeter: React.FC<BiomedicalMeterProps> = ({ measurement }) => {
  const [showAccuracyInfo, setShowAccuracyInfo] = useState(false);

  if (!measurement.data) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Initializing {getMeasurementName(measurement.type)} monitor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{getMeasurementName(measurement.type)}</Text>
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
            Mobile devices provide approximate {getMeasurementName(measurement.type).toLowerCase()} measurements. Different devices may show different readings.
          </Text>
          <Text style={styles.accuracyDisclaimerText}>
            For professional measurements, use medical-grade devices.
          </Text>
        </View>
      )}

      {/* Confidence Level Indicator */}
      <ConfidenceLevelIndicator confidenceLevel={getConfidenceLevel(measurement)} />
      
      {/* Render the appropriate meter based on measurement type */}
      {renderMeterContent(measurement)}
    </View>
  );
};

// Helper to get the measurement name for display
const getMeasurementName = (type: string): string => {
  switch (type) {
    case 'sound': return 'Sound Level';
    case 'cardiac': return 'Heart Rate';
    case 'respiratory': return 'Respiratory Rate';
    case 'tremor': return 'Tremor Analysis';
    case 'gait': return 'Gait Analysis';
    case 'speech': return 'Speech Analysis';
    default: return 'Biomedical Monitor';
  }
};

// Helper to get the confidence level
const getConfidenceLevel = (measurement: MeasurementType): ConfidenceLevel => {
  if (!measurement.data) return 'low';
  
  if (measurement.type === 'sound') {
    return (measurement.data as SoundMeasurement).confidenceLevel || 'medium';
  } else {
    return (measurement.data as any).confidenceLevel || 'medium';
  }
};

// Confidence level indicator component
const ConfidenceLevelIndicator: React.FC<{ confidenceLevel: ConfidenceLevel }> = ({ confidenceLevel }) => {
  // Get confidence level icon and text
  const getConfidenceLevelInfo = (confidenceLevel?: string) => {
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
    <View style={[styles.confidenceLevelContainer, { borderColor: confidenceInfo.color }]}>
      <Ionicons name={confidenceInfo.icon as any} size={16} color={confidenceInfo.color} />
      <Text style={[styles.confidenceLevelText, { color: confidenceInfo.color }]}>
        {confidenceInfo.text}
      </Text>
    </View>
  );
};

// Render meter content based on measurement type
const renderMeterContent = (measurement: MeasurementType) => {
  const { type, data } = measurement;
  
  if (!data) return null;
  
  switch (type) {
    case 'sound':
      return <SoundMeterContent measurement={data} />;
    case 'cardiac':
      return <CardiacMeterContent measurement={data} />;
    case 'respiratory':
      return <RespiratoryMeterContent measurement={data} />;
    case 'tremor':
      return <TremorMeterContent measurement={data} />;
    case 'gait':
      return <GaitMeterContent measurement={data} />;
    case 'speech':
      return <SpeechMeterContent measurement={data} />;
    default:
      return null;
  }
};

// Sound meter content
const SoundMeterContent: React.FC<{ measurement: SoundMeasurement }> = ({ measurement }) => {
  const { dB, category } = measurement;
  
  return (
    <View>
      <Text style={styles.primaryValue}>{dB.toFixed(1)} dB</Text>
      <View style={[styles.categoryContainer, { backgroundColor: category.color }]}>
        <Text style={styles.categoryText}>{category.description}</Text>
      </View>
      <View style={styles.actionContainer}>
        <Text style={styles.actionTitle}>Recommended Action:</Text>
        <Text style={styles.actionText}>{category.action}</Text>
      </View>
    </View>
  );
};

// Cardiac meter content
const CardiacMeterContent: React.FC<{ measurement: CardiacMeasurement }> = ({ measurement }) => {
  const { heartRate, category } = measurement;
  
  return (
    <View>
      <Text style={styles.primaryValue}>{heartRate} BPM</Text>
      <View style={[styles.categoryContainer, { backgroundColor: category.color }]}>
        <Text style={styles.categoryText}>{category.description}</Text>
      </View>
      <View style={styles.actionContainer}>
        <Text style={styles.actionTitle}>Recommended Action:</Text>
        <Text style={styles.actionText}>{category.action}</Text>
      </View>
    </View>
  );
};

// Respiratory meter content
const RespiratoryMeterContent: React.FC<{ measurement: RespiratoryMeasurement }> = ({ measurement }) => {
  const { breathsPerMinute, category } = measurement;
  
  return (
    <View>
      <Text style={styles.primaryValue}>{breathsPerMinute.toFixed(1)} breaths/min</Text>
      <View style={[styles.categoryContainer, { backgroundColor: category.color }]}>
        <Text style={styles.categoryText}>{category.description}</Text>
      </View>
      <View style={styles.actionContainer}>
        <Text style={styles.actionTitle}>Recommended Action:</Text>
        <Text style={styles.actionText}>{category.action}</Text>
      </View>
    </View>
  );
};

// Tremor meter content
const TremorMeterContent: React.FC<{ measurement: TremorMeasurement }> = ({ measurement }) => {
  const { intensity, frequency, category } = measurement;
  
  return (
    <View>
      <Text style={styles.primaryValue}>{intensity.toFixed(3)}</Text>
      <Text style={styles.secondaryValue}>{frequency.toFixed(1)} Hz</Text>
      <View style={[styles.categoryContainer, { backgroundColor: category.color }]}>
        <Text style={styles.categoryText}>{category.description}</Text>
      </View>
      <View style={styles.actionContainer}>
        <Text style={styles.actionTitle}>Recommended Action:</Text>
        <Text style={styles.actionText}>{category.action}</Text>
      </View>
    </View>
  );
};

// Gait meter content
const GaitMeterContent: React.FC<{ measurement: GaitMeasurement }> = ({ measurement }) => {
  const { stepsPerMinute, symmetry, stability, category } = measurement;
  
  return (
    <View>
      <Text style={styles.primaryValue}>{stepsPerMinute.toFixed(0)} steps/min</Text>
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricTitle}>Symmetry</Text>
          <Text style={styles.metricValue}>{(symmetry * 100).toFixed(0)}%</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricTitle}>Stability</Text>
          <Text style={styles.metricValue}>{(stability * 100).toFixed(0)}%</Text>
        </View>
      </View>
      <View style={[styles.categoryContainer, { backgroundColor: category.color }]}>
        <Text style={styles.categoryText}>{category.description}</Text>
      </View>
      <View style={styles.actionContainer}>
        <Text style={styles.actionTitle}>Recommended Action:</Text>
        <Text style={styles.actionText}>{category.action}</Text>
      </View>
    </View>
  );
};

// Speech meter content
const SpeechMeterContent: React.FC<{ measurement: SpeechMeasurement }> = ({ measurement }) => {
  const { clarity, volume, rhythm, category } = measurement;
  
  return (
    <View>
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricTitle}>Clarity</Text>
          <Text style={styles.metricValue}>{(clarity * 100).toFixed(0)}%</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricTitle}>Volume</Text>
          <Text style={styles.metricValue}>{(volume * 100).toFixed(0)}%</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricTitle}>Rhythm</Text>
          <Text style={styles.metricValue}>{(rhythm * 100).toFixed(0)}%</Text>
        </View>
      </View>
      <View style={[styles.categoryContainer, { backgroundColor: category.color }]}>
        <Text style={styles.categoryText}>{category.description}</Text>
      </View>
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
  primaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  secondaryValue: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 16,
    color: '#666',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
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

export default BiomedicalMeter; 
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Text, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

interface WaveformMeterProps {
  value: number;
  maxValue: number;
  unit: string;
  label: string;
  category: {
    name: string;
    color: string;
    description: string;
  };
  confidence?: 'high' | 'medium' | 'low';
}

const WaveformMeter: React.FC<WaveformMeterProps> = ({
  value,
  maxValue,
  unit,
  label,
  category,
  confidence = 'medium',
}) => {
  // Screen dimensions
  const { width } = Dimensions.get('window');
  const meterWidth = width * 0.85;

  // Animated values
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const waveAnim3 = useRef(new Animated.Value(0)).current;
  const valueAnim = useRef(new Animated.Value(0)).current;
  
  // Determine colors based on category
  const getWaveColors = () => {
    const baseColor = category.color;
    let gradientColors = [baseColor, baseColor + '80', baseColor + '40'];
    
    if (baseColor === Colors.categories.safe) {
      gradientColors = [Colors.accent.teal, Colors.accent.teal + '90', Colors.accent.mint];
    } else if (baseColor === Colors.categories.moderate) {
      gradientColors = [Colors.accent.coral, Colors.accent.coral + '90', Colors.categories.moderate];
    } else if (baseColor === Colors.categories.dangerous) {
      gradientColors = [Colors.functional.error, Colors.functional.error + '90', Colors.categories.veryHigh];
    }
    
    return gradientColors;
  };
  
  // Start animations
  useEffect(() => {
    // Animate value counter
    Animated.timing(valueAnim, {
      toValue: value,
      duration: 800,
      useNativeDriver: false,
    }).start();
    
    // Create wave animations
    const createWaveAnimation = (waveAnim: Animated.Value, duration: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    
    // Start waves with different durations for a more natural effect
    createWaveAnimation(waveAnim1, 2000);
    createWaveAnimation(waveAnim2, 2500);
    createWaveAnimation(waveAnim3, 3000);
    
    return () => {
      // Clean up animations
      waveAnim1.stopAnimation();
      waveAnim2.stopAnimation();
      waveAnim3.stopAnimation();
      valueAnim.stopAnimation();
    };
  }, [value]);
  
  // Calculate intensity based on value percentage
  const intensity = value / maxValue;
  const fillHeight = 150 * Math.min(intensity, 1);
  
  // Calculate wave transforms
  const wave1Transform = waveAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-meterWidth * 0.1, 0, -meterWidth * 0.1],
  });
  
  const wave2Transform = waveAnim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-meterWidth * 0.15, 0, -meterWidth * 0.15],
  });
  
  const wave3Transform = waveAnim3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-meterWidth * 0.2, 0, -meterWidth * 0.2],
  });
  
  // Animated display value
  const displayValue = valueAnim.interpolate({
    inputRange: [0, value],
    outputRange: [0, value],
  });
  
  // Get confidence icon and color
  const getConfidenceInfo = () => {
    switch (confidence) {
      case 'high':
        return {
          icon: 'shield-checkmark-outline',
          color: Colors.confidence.high,
          text: 'High confidence',
        };
      case 'medium':
        return {
          icon: 'shield-outline',
          color: Colors.confidence.medium,
          text: 'Medium confidence',
        };
      case 'low':
        return {
          icon: 'shield-outline',
          color: Colors.confidence.low,
          text: 'Low confidence',
        };
      default:
        return {
          icon: 'shield-outline',
          color: Colors.confidence.medium,
          text: 'Medium confidence',
        };
    }
  };
  
  const confidenceInfo = getConfidenceInfo();
  const waveColors = getWaveColors();
  
  return (
    <View style={styles.container}>
      {/* Meter header with label */}
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.confidenceContainer}>
          <Ionicons
            name={confidenceInfo.icon as any}
            size={16}
            color={confidenceInfo.color}
          />
          <Text style={[styles.confidenceText, { color: confidenceInfo.color }]}>
            {confidenceInfo.text}
          </Text>
        </View>
      </View>
      
      {/* Main meter container */}
      <View style={styles.meterContainer}>
        {/* Value display */}
        <View style={styles.valueContainer}>
          <Animated.Text style={styles.value}>
            {displayValue.interpolate({
              inputRange: [0, value],
              outputRange: ['0', value.toFixed(1)],
            })}
          </Animated.Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
        
        {/* Waveform visualization */}
        <View style={[styles.waveformContainer, { height: 150, width: meterWidth }]}>
          <View style={[styles.waveformBackground, { height: 150 }]} />
          
          <View style={[styles.waveformFill, { height: fillHeight }]}>
            <Animated.View
              style={[
                styles.wave,
                styles.wave1,
                { transform: [{ translateX: wave1Transform }] },
              ]}
            >
              <LinearGradient
                colors={[waveColors[0], waveColors[1]]}
                style={styles.waveGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            
            <Animated.View
              style={[
                styles.wave,
                styles.wave2,
                { transform: [{ translateX: wave2Transform }] },
              ]}
            >
              <LinearGradient
                colors={[waveColors[1], waveColors[2]]}
                style={styles.waveGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            
            <Animated.View
              style={[
                styles.wave,
                styles.wave3,
                { transform: [{ translateX: wave3Transform }] },
              ]}
            >
              <LinearGradient
                colors={[waveColors[2], waveColors[0] + '40']}
                style={styles.waveGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
          </View>
          
          {/* Marker lines */}
          <View style={styles.markerContainer}>
            {[0.25, 0.5, 0.75].map((mark, index) => (
              <View 
                key={index} 
                style={[
                  styles.marker, 
                  { bottom: 150 * mark }
                ]} 
              />
            ))}
          </View>
        </View>
      </View>
      
      {/* Category indicator */}
      <View style={[styles.categoryContainer, { backgroundColor: category.color + '20' }]}>
        <View style={[styles.categoryIndicator, { backgroundColor: category.color }]} />
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryDescription}>{category.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: Typography.variant.h4.fontSize,
    fontWeight: Typography.variant.h4.fontWeight as TextStyle['fontWeight'],
    lineHeight: Typography.variant.h4.lineHeight,
    letterSpacing: Typography.variant.h4.letterSpacing,
    color: Colors.primary.main,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.lightest,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  confidenceText: {
    fontSize: Typography.variant.caption.fontSize,
    fontWeight: Typography.variant.caption.fontWeight as TextStyle['fontWeight'],
    lineHeight: Typography.variant.caption.lineHeight,
    letterSpacing: Typography.variant.caption.letterSpacing,
    marginLeft: 4,
  },
  meterContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  valueContainer: {
    position: 'absolute',
    top: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: Typography.variant.dataValue.fontSize,
    fontWeight: Typography.variant.dataValue.fontWeight as TextStyle['fontWeight'],
    lineHeight: Typography.variant.dataValue.lineHeight,
    letterSpacing: Typography.variant.dataValue.letterSpacing,
    color: Colors.primary.dark,
  },
  unit: {
    fontSize: Typography.variant.dataUnit.fontSize,
    fontWeight: Typography.variant.dataUnit.fontWeight as TextStyle['fontWeight'],
    lineHeight: Typography.variant.dataUnit.lineHeight,
    letterSpacing: Typography.variant.dataUnit.letterSpacing,
    color: Colors.primary.dark,
    marginBottom: 8,
    marginLeft: 4,
  },
  waveformContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: Colors.neutral.lightest,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  waveformBackground: {
    position: 'absolute',
    width: '100%',
    backgroundColor: Colors.neutral.lightest,
  },
  waveformFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    height: '100%',
    width: '200%',
  },
  wave1: {
    zIndex: 3,
    opacity: 0.8,
  },
  wave2: {
    zIndex: 2,
    opacity: 0.6,
  },
  wave3: {
    zIndex: 1,
    opacity: 0.4,
  },
  waveGradient: {
    height: '100%',
    width: '100%',
  },
  markerContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: Colors.neutral.light,
  },
  categoryContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 16,
  },
  categoryIndicator: {
    height: 6,
    width: 40,
    borderRadius: 3,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: Typography.variant.h5.fontSize,
    fontWeight: Typography.variant.h5.fontWeight as TextStyle['fontWeight'],
    lineHeight: Typography.variant.h5.lineHeight,
    letterSpacing: Typography.variant.h5.letterSpacing,
    color: Colors.neutral.darkest,
    marginBottom: 6,
  },
  categoryDescription: {
    fontSize: Typography.variant.body2.fontSize,
    fontWeight: Typography.variant.body2.fontWeight as TextStyle['fontWeight'],
    lineHeight: Typography.variant.body2.lineHeight,
    letterSpacing: Typography.variant.body2.letterSpacing,
    color: Colors.neutral.dark,
    textAlign: 'center',
  },
});

export default WaveformMeter; 
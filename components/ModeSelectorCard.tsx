import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BiomedicalMonitoringMode } from '../utils/biomedicalSensors';
import { Colors } from '../constants/Colors';

// Create a type that excludes 'none' from BiomedicalMonitoringMode
type DisplayableMonitoringMode = Exclude<BiomedicalMonitoringMode, 'none'>;

interface ModeSelectorCardProps {
  mode: DisplayableMonitoringMode;
  isActive: boolean;
  onSelect: (mode: DisplayableMonitoringMode) => void;
}

const ModeSelectorCard: React.FC<ModeSelectorCardProps> = ({ mode, isActive, onSelect }) => {
  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  // Get icon based on mode
  const getIcon = (): string => {
    switch (mode) {
      case 'sound':
        return 'volume-high-outline';
      case 'cardiac':
        return 'heart-outline';
      case 'respiratory':
        return 'fitness-outline';
      case 'tremor':
        return 'hand-left-outline';
      case 'gait':
        return 'walk-outline';
      case 'speech':
        return 'mic-outline';
      default:
        return 'medical-outline';
    }
  };

  // Get color based on mode
  const getColor = (): string => {
    switch (mode) {
      case 'sound':
        return Colors.modes.sound;
      case 'cardiac':
        return Colors.modes.cardiac;
      case 'respiratory':
        return Colors.modes.respiratory;
      case 'tremor':
        return Colors.modes.tremor;
      case 'gait':
        return Colors.modes.gait;
      case 'speech':
        return Colors.modes.speech;
      default:
        return Colors.primary.main;
    }
  };

  // Get gradient colors based on mode
  const getGradient = () => {
    const baseColor = getColor();
    
    // Default gradient (for inactive state)
    const defaultGradient = ['#ffffff', '#f8f9fa'] as [string, string];
    
    if (!isActive) return defaultGradient;
    
    switch (mode) {
      case 'sound':
        return [
          Colors.gradients.sound[0], 
          Colors.gradients.sound[1]
        ] as [string, string];
      case 'cardiac':
        return [
          Colors.gradients.cardiac[0], 
          Colors.gradients.cardiac[1]
        ] as [string, string];
      case 'respiratory':
        return [
          Colors.gradients.respiratory[0], 
          Colors.gradients.respiratory[1]
        ] as [string, string];
      case 'tremor':
        return [
          Colors.gradients.tremor[0], 
          Colors.gradients.tremor[1]
        ] as [string, string];
      case 'gait':
        return [
          Colors.gradients.gait[0], 
          Colors.gradients.gait[1]
        ] as [string, string];
      case 'speech':
        return [
          Colors.gradients.speech[0], 
          Colors.gradients.speech[1]
        ] as [string, string];
      default:
        return [`${baseColor}30`, `${baseColor}10`] as [string, string];
    }
  };

  // Get label based on mode
  const getLabel = (): string => {
    switch (mode) {
      case 'sound':
        return 'Sound';
      case 'cardiac':
        return 'Heart Rate';
      case 'respiratory':
        return 'Respiratory';
      case 'tremor':
        return 'Tremor';
      case 'gait':
        return 'Gait';
      case 'speech':
        return 'Speech';
      default:
        return 'Unknown';
    }
  };

  // Get description based on mode
  const getDescription = (): string => {
    switch (mode) {
      case 'sound':
        return 'Monitor noise levels';
      case 'cardiac':
        return 'Track heart activity';
      case 'respiratory':
        return 'Measure breathing rate';
      case 'tremor':
        return 'Detect hand tremors';
      case 'gait':
        return 'Analyze walking patterns';
      case 'speech':
        return 'Evaluate speech clarity';
      default:
        return '';
    }
  };
  
  // Animation effects
  useEffect(() => {
    if (isActive) {
      // Start continuous pulse animation for active card
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin)
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin)
          })
        ])
      ).start();

      // Rotate animation for active icon
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5))
      }).start();
      
      // Glow animation for active card
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.sin)
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.sin)
          })
        ])
      ).start();
    } else {
      // Reset animations when card becomes inactive
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
      
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
      
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start();
    }
  }, [isActive]);

  // Handle press animations
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad)
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.elastic(1.2))
    }).start();
  };

  const cardColor = getColor();
  const iconName = getIcon();
  const label = getLabel();
  const description = getDescription();
  const gradientColors = getGradient();
  
  // Icon rotation interpolation
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  // Opacity for glow effect
  const glowOpacity = glowAnim;

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 64) * 0.48; // More precise width calculation based on container padding and gap

  return (
    <TouchableOpacity
      style={[styles.touchable, { width: cardWidth }]}
      onPress={() => onSelect(mode)}
      activeOpacity={0.95}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        style={[
          styles.card,
          {
            transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
            borderColor: isActive ? cardColor : 'transparent',
          }
        ]}
      >
        {/* Linear Gradient Background */}
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Glow Effect */}
        {isActive && (
          <Animated.View 
            style={[
              styles.glowEffect, 
              { 
                backgroundColor: cardColor,
                opacity: glowOpacity
              }
            ]} 
          />
        )}
        
        {/* Main Icon */}
        <Animated.View 
          style={[
            styles.iconContainer,
            {
              backgroundColor: isActive ? '#ffffff' : `${cardColor}15`,
              transform: [{ rotate: rotate }],
              shadowColor: cardColor,
            }
          ]}
        >
          <Ionicons 
            name={iconName as any} 
            size={26} 
            color={isActive ? cardColor : cardColor} 
          />
        </Animated.View>
        
        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.label,
              { color: isActive ? '#ffffff' : Colors.neutral.darkest }
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
          <Text 
            style={[
              styles.description,
              { color: isActive ? 'rgba(255,255,255,0.9)' : Colors.neutral.medium }
            ]}
            numberOfLines={1}
          >
            {description}
          </Text>
        </View>
        
        {/* Active Indicator */}
        {/* {isActive && (
          <View style={[styles.activeIndicator, { backgroundColor: '#ffffff' }]}>
            <Ionicons name="checkmark" size={12} color={cardColor} />
          </View>
        )} */}
        
        {/* Small Icon Decorations */}
        {isActive && (
          <>
            <View 
              style={[
                styles.decorIcon, 
                styles.decorIcon1, 
                { backgroundColor: 'rgba(255,255,255,0.25)' }
              ]}
            >
              <Ionicons name={iconName as any} size={10} color="#ffffff" />
            </View>
            <View 
              style={[
                styles.decorIcon, 
                styles.decorIcon2, 
                { backgroundColor: 'rgba(255,255,255,0.25)' }
              ]}
            >
              <Ionicons name={iconName as any} size={8} color="#ffffff" />
            </View>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 16,
    height: 150,
    marginHorizontal: '1%', // Add small horizontal margin for perfect spacing
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 8,
    height: '100%',
    width: '100%', 
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
  },
  glowEffect: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.15,
    zIndex: 0,
    transform: [{ scale: 1.5 }],
  },
 iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
},
  textContainer: {
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 1,
  },
  decorIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    zIndex: 1,
  },
  decorIcon1: {
    width: 20,
    height: 20,
    bottom: 20,
    left: 15,
  },
  decorIcon2: {
    width: 16,
    height: 16,
    top: 25,
    right: 15,
  },
});

export default ModeSelectorCard;
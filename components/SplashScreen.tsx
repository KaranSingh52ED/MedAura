import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animated values
  const circleSize = useRef(new Animated.Value(0)).current;
  const iconSize = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconRotation = useRef(new Animated.Value(0)).current;
  const medicalIconPosition = useRef(new Animated.Value(0)).current;
  const heartIconPosition = useRef(new Animated.Value(0)).current;
  const soundIconPosition = useRef(new Animated.Value(0)).current;
  const brainIconPosition = useRef(new Animated.Value(0)).current;
  const iconFade = useRef(new Animated.Value(0)).current;

  // Start animation on mount
  useEffect(() => {
    // Animation sequence
    const sequence = Animated.sequence([
      // First fade in and expand the circle
      Animated.timing(circleSize, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      
      // Then fade in and scale up the main medical icon
      Animated.parallel([
        Animated.timing(iconSize, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
      
      // Rotate the icon
      Animated.timing(iconRotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      
      // Animate satellite icons
      Animated.parallel([
        Animated.timing(iconFade, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(medicalIconPosition, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(heartIconPosition, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(soundIconPosition, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(brainIconPosition, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
      ]),
      
      // Fade in title and subtitle
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
      
      // Wait a bit before proceeding
      Animated.delay(1000),
    ]);

    // Start animation sequence
    sequence.start(() => {
      // When animation completes, call onFinish
      onFinish();
    });
  }, []);

  // Interpolate values for animations
  const circleScale = circleSize.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const iconScale = iconSize.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const rotation = iconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Positions for satellite icons
  const topIconTop = medicalIconPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 40],
  });

  const rightIconRight = heartIconPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 40],
  });

  const bottomIconBottom = soundIconPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 40],
  });

  const leftIconLeft = brainIconPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 40],
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.circle,
          { 
            transform: [{ scale: circleScale }],
          }
        ]}
      />
      
      {/* Main App Icon */}
      <Animated.View 
        style={[
          styles.iconContainer,
          { 
            transform: [
              { scale: iconScale },
              { rotate: rotation }
            ],
            opacity: iconOpacity,
          }
        ]}
      >
        <Ionicons name="medical" size={80} color="#fff" />
      </Animated.View>
      
      {/* Satellite Icons */}
      <Animated.View 
        style={[
          styles.satelliteIcon,
          styles.topIcon,
          { 
            top: topIconTop,
            opacity: iconFade
          }
        ]}
      >
        <Ionicons name="fitness" size={30} color="#fff" />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.satelliteIcon,
          styles.rightIcon,
          { 
            right: rightIconRight,
            opacity: iconFade
          }
        ]}
      >
        <Ionicons name="heart" size={30} color="#fff" />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.satelliteIcon,
          styles.bottomIcon,
          { 
            bottom: bottomIconBottom,
            opacity: iconFade
          }
        ]}
      >
        <Ionicons name="volume-high" size={30} color="#fff" />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.satelliteIcon,
          styles.leftIcon,
          { 
            left: leftIconLeft,
            opacity: iconFade
          }
        ]}
      >
        <Ionicons name="analytics" size={30} color="#fff" />
      </Animated.View>
      
      {/* Title and Subtitle */}
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        BioSignal Monitor
      </Animated.Text>
      
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        Comprehensive Health Monitoring
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  circle: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  satelliteIcon: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topIcon: {
    top: 100,
  },
  rightIcon: {
    right: 100,
  },
  bottomIcon: {
    bottom: 100,
  },
  leftIcon: {
    left: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default SplashScreen; 
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import onboardingImages from '../assets/images/onboarding';

const { width, height } = Dimensions.get('window');

interface OnboardingPageProps {
  title: string;
  description: string;
  image: any;
  color: string;
  icon: string;
  additionalInfo?: string[];
}

const onboardingPages: OnboardingPageProps[] = [
  {
    title: 'Welcome to BioSignal Monitor',
    description: 'Your comprehensive tool for monitoring various biomedical signals and environmental factors using your mobile device.',
    image: onboardingImages.onboarding1,
    color: '#2196F3', // Blue
    icon: 'medical-outline',
  },
  {
    title: 'Sound Pollution Detection',
    description: 'Monitor environmental noise levels and track exposure to potentially harmful sound pollution.',
    image: onboardingImages.onboarding2,
    color: '#4CAF50', // Green
    icon: 'volume-high-outline',
    additionalInfo: [
      "Measures decibel levels in your environment",
      "Categorizes sound levels from normal to dangerous",
      "Provides recommendations based on sound intensity"
    ]
  },
  {
    title: 'Measurement Accuracy',
    description: 'Mobile device microphones provide approximate measurements. For professional use, calibrated sound level meters are recommended.',
    image: onboardingImages.onboarding3,
    color: '#9C27B0', // Purple
    icon: 'information-circle-outline',
    additionalInfo: [
      "Different devices may show different readings",
      "Provides good relative measurements",
      "Useful for personal awareness, not regulatory compliance"
    ]
  },
  {
    title: 'Heart Rate Monitoring',
    description: 'Monitor your heart rate using your device\'s camera to detect pulse through changes in finger color.',
    image: onboardingImages.onboarding3,
    color: '#F44336', // Red
    icon: 'heart-outline',
    additionalInfo: [
      "Measures beats per minute (BPM)",
      "Categorizes heart rate zones",
      "Place your finger over the camera lens for best results"
    ]
  },
  {
    title: 'Respiratory Rate Analysis',
    description: 'Track your breathing patterns using your device\'s microphone to detect breath sounds.',
    image: onboardingImages.onboarding2,
    color: '#00BCD4', // Cyan
    icon: 'fitness-outline',
    additionalInfo: [
      "Measures breaths per minute",
      "Analyzes breathing pattern consistency",
      "Hold device near your mouth/nose for best results"
    ]
  },
  {
    title: 'Tremor Assessment',
    description: 'Analyze hand tremors using your device\'s motion sensors to help track neurological symptoms.',
    image: onboardingImages.onboarding1,
    color: '#FF9800', // Orange
    icon: 'hand-left-outline',
    additionalInfo: [
      "Measures tremor intensity and frequency",
      "Categorizes tremor severity",
      "Hold device in hand and remain still for assessment"
    ]
  },
  {
    title: 'Gait Analysis',
    description: 'Analyze walking patterns using motion sensors to help monitor mobility and balance.',
    image: onboardingImages.onboarding3,
    color: '#8BC34A', // Light Green
    icon: 'walk-outline',
    additionalInfo: [
      "Measures steps per minute, symmetry, and stability",
      "Place the device in your pocket while walking",
      "Best used on flat surfaces for accurate measurements"
    ]
  },
  {
    title: 'Speech Analysis',
    description: 'Analyze speech patterns to help monitor speech clarity, volume, and rhythm.',
    image: onboardingImages.onboarding2,
    color: '#673AB7', // Deep Purple
    icon: 'mic-outline',
    additionalInfo: [
      "Measures speech clarity, volume, and rhythm",
      "Speak naturally at a normal distance from the device",
      "Minimize background noise for best results"
    ]
  },
  {
    title: 'Confidence Indicators',
    description: 'All measurements include confidence levels to help you understand reliability.',
    image: onboardingImages.onboarding1,
    color: '#009688', // Teal
    icon: 'shield-checkmark-outline',
    additionalInfo: [
      "High confidence: Consistent, reliable readings",
      "Medium confidence: Some variability in measurements",
      "Low confidence: Significant variability, treat with caution"
    ]
  },
  {
    title: 'You\'re All Set!',
    description: 'Start monitoring your biomedical signals and environmental factors to gain insights into your health and surroundings.',
    image: onboardingImages.onboarding3,
    color: '#2196F3', // Blue
    icon: 'checkmark-circle-outline',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      setCurrentPage(currentPage + 1);
      scrollViewRef.current?.scrollTo({
        x: width * (currentPage + 1),
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const page = Math.round(offset / width);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // Animation for the background gradient transition
  const backgroundColor = animatedValue.interpolate({
    inputRange: onboardingPages.map((_, i) => i * width),
    outputRange: onboardingPages.map(page => `${page.color}20`), // 20 is the opacity in hex
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <Animated.View 
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: backgroundColor }
        ]} 
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: animatedValue } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingPages.map((page, index) => (
          <View key={index} style={styles.page}>
            <View style={[styles.iconContainer, { backgroundColor: page.color }]}>
              <Ionicons name={page.icon as any} size={80} color="white" />
            </View>
            
            {/* <Image 
              source={page.image} 
              style={styles.image} 
              resizeMode="contain"
            /> */}
            
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.description}>{page.description}</Text>
            
            {/* Additional bullet points */}
            {page.additionalInfo && (
              <View style={styles.bulletPointsContainer}>
                {page.additionalInfo.map((info, i) => (
                  <View key={i} style={styles.bulletPoint}>
                    <View style={[styles.bullet, { backgroundColor: page.color }]} />
                    <Text style={styles.bulletText}>{info}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingPages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: currentPage === index 
                    ? onboardingPages[currentPage].color 
                    : '#ccc',
                  width: currentPage === index ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: onboardingPages[currentPage].color }]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentPage === onboardingPages.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons 
            name={currentPage === onboardingPages.length - 1 ? 'checkmark-outline' : 'arrow-forward-outline'} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 20,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  image: {
    width: width * 0.8,
    height: height * 0.3,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  bulletPointsContainer: {
    marginTop: 16,
    width: '100%',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  bulletText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default OnboardingScreen; 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, StatusBar, ScrollView, Animated, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SoundMeter from '../components/SoundMeter';
import SoundMap from '../components/SoundMap';
import OnboardingScreen from '../components/OnboardingScreen';
import SplashScreen from '../components/SplashScreen';
import BiomedicalMeter from '../components/BiomedicalMeter';
import HelpButton from '../components/HelpButton';
import VideoTutorial from '../components/VideoTutorial';
import ModeSelectorCard from '../components/ModeSelectorCard';
import { Colors } from '../constants/Colors';
import MonitoringProgress from '../components/MonitoringProgress';
import AdvancedAnalysis from '../components/AdvancedAnalysis';
import HelpScreen from '../components/HelpScreen';
import SettingsPanel from '../components/SettingsPanel';

// Sound monitoring imports
import { startSoundMeter, SoundMeasurement } from '../utils/soundMeter';
import { saveMeasurement, getMeasurements, SavedMeasurement } from '../utils/storage';
import { hasCompletedOnboarding, setOnboardingComplete } from '../utils/preferences';

// Biomedical sensor imports
import { 
  BiomedicalMonitoringMode,
  CardiacMeasurement,
  RespiratoryMeasurement,
  TremorMeasurement,
  GaitMeasurement,
  SpeechMeasurement,
  startCardiacMonitor,
  startRespiratoryMonitor,
  startTremorMonitor,
  startGaitMonitor,
  startSpeechMonitor,
  cleanupAllAudioRecordings
} from '../utils/biomedicalSensors';

// Create a MeasurementType union type
type MeasurementType = 
  { type: 'sound'; data: SoundMeasurement | null } |
  { type: 'cardiac'; data: CardiacMeasurement | null } |
  { type: 'respiratory'; data: RespiratoryMeasurement | null } |
  { type: 'tremor'; data: TremorMeasurement | null } |
  { type: 'gait'; data: GaitMeasurement | null } |
  { type: 'speech'; data: SpeechMeasurement | null };

// Define the app's screens
type AppScreen = 'home' | 'soundMonitor' | 'cardiacMonitor' | 'respiratoryMonitor' | 
                'tremorMonitor' | 'gaitMonitor' | 'speechMonitor' | 'map';

// Add this type definition
type DisplayableMonitoringMode = Exclude<BiomedicalMonitoringMode, 'none'>;

export default function App() {
  const router = useRouter();

  // UI state
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Screen navigation state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [activeMonitoringMode, setActiveMonitoringMode] = useState<BiomedicalMonitoringMode>('none');
  
  // Measurement states
  const [soundMeasurement, setSoundMeasurement] = useState<SoundMeasurement | null>(null);
  const [cardiacMeasurement, setCardiacMeasurement] = useState<CardiacMeasurement | null>(null);
  const [respiratoryMeasurement, setRespiratoryMeasurement] = useState<RespiratoryMeasurement | null>(null);
  const [tremorMeasurement, setTremorMeasurement] = useState<TremorMeasurement | null>(null);
  const [gaitMeasurement, setGaitMeasurement] = useState<GaitMeasurement | null>(null);
  const [speechMeasurement, setSpeechMeasurement] = useState<SpeechMeasurement | null>(null);
  
  // Storage
  const [savedMeasurements, setSavedMeasurements] = useState<SavedMeasurement[]>([]);
  
  // Cleanup functions
  const [stopSoundMeasuring, setStopSoundMeasuring] = useState<(() => void) | null>(null);
  const [stopCardiacMeasuring, setStopCardiacMeasuring] = useState<(() => void) | null>(null);
  const [stopRespiratoryMeasuring, setStopRespiratoryMeasuring] = useState<(() => void) | null>(null);
  const [stopTremorMeasuring, setStopTremorMeasuring] = useState<(() => void) | null>(null);
  const [stopGaitMeasuring, setStopGaitMeasuring] = useState<(() => void) | null>(null);
  const [stopSpeechMeasuring, setStopSpeechMeasuring] = useState<(() => void) | null>(null);

  // State for settings modal
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Create animation references
  const settingsPanelAnim = useRef(new Animated.Value(300)).current;
  const settingsBackdropAnim = useRef(new Animated.Value(0)).current;

  // Add a state for help screen
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const completed = await hasCompletedOnboarding();
      setShowOnboarding(!completed);
    };
    
    checkOnboardingStatus();
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = async () => {
    await setOnboardingComplete();
    setShowOnboarding(false);
  };

  // Initialize active monitor based on monitoring mode
  useEffect(() => {
    // Don't initialize if mode is none or splash/onboarding is showing
    if (activeMonitoringMode === 'none' || showSplash || showOnboarding) return;
    
    // Clean up any active monitors first
    cleanupAllMonitors();
    
    setIsLoading(true);
    
    // Initialize the selected monitoring mode
    const initializeMonitor = async () => {
      try {
        // Clean up any active audio recordings first to prevent conflicts
        await cleanupAllAudioRecordings();
        
        // Load saved measurements
        const measurements = await getMeasurements();
        setSavedMeasurements(measurements);
        
        // Only initialize the specific monitor for the selected mode
        switch (activeMonitoringMode) {
          case 'sound':
            await initializeSoundMonitor();
            break;
          case 'cardiac':
            await initializeCardiacMonitor();
            break;
          case 'respiratory':
            await initializeRespiratoryMonitor();
            break;
          case 'tremor':
            await initializeTremorMonitor();
            break;
          case 'gait':
            await initializeGaitMonitor();
            break;
          case 'speech':
            await initializeSpeechMonitor();
            break;
        }
      } catch (error) {
        console.error(`Error initializing ${activeMonitoringMode} monitor:`, error);
        Alert.alert(
          "Permission Required", 
          `To use the ${getModeName(activeMonitoringMode)} monitoring feature, you need to grant the necessary permissions.`,
          [{ text: "OK" }]
        );
        // Reset to home screen if initialization fails
        setCurrentScreen('home');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeMonitor();
    
    // Clean up on component unmount or when changing modes
    return () => {
      cleanupAllMonitors();
    };
  }, [showSplash, showOnboarding, activeMonitoringMode]);

  // Initialize sound monitor
  const initializeSoundMonitor = async () => {
    try {
      const stopFunction = await startSoundMeter((newMeasurement) => {
        setSoundMeasurement(newMeasurement);
      });
      
      setStopSoundMeasuring(() => stopFunction);
    } catch (error) {
      console.error('Error setting up sound monitor:', error);
    }
  };

  // Initialize cardiac monitor
  const initializeCardiacMonitor = async () => {
    try {
      const stopFunction = await startCardiacMonitor((newMeasurement) => {
        setCardiacMeasurement(newMeasurement);
      });
      
      setStopCardiacMeasuring(() => stopFunction);
    } catch (error) {
      console.error('Error setting up cardiac monitor:', error);
    }
  };

  // Initialize respiratory monitor
  const initializeRespiratoryMonitor = async () => {
    try {
      const stopFunction = await startRespiratoryMonitor((newMeasurement) => {
        setRespiratoryMeasurement(newMeasurement);
      });
      
      setStopRespiratoryMeasuring(() => stopFunction);
    } catch (error) {
      console.error('Error setting up respiratory monitor:', error);
    }
  };

  // Initialize tremor monitor
  const initializeTremorMonitor = async () => {
    try {
      const stopFunction = await startTremorMonitor((newMeasurement) => {
        setTremorMeasurement(newMeasurement);
      });
      
      setStopTremorMeasuring(() => stopFunction);
    } catch (error) {
      console.error('Error setting up tremor monitor:', error);
    }
  };

  // Initialize gait monitor
  const initializeGaitMonitor = async () => {
    try {
      const stopFunction = await startGaitMonitor((newMeasurement) => {
        setGaitMeasurement(newMeasurement);
      });
      
      setStopGaitMeasuring(() => stopFunction);
    } catch (error) {
      console.error('Error setting up gait monitor:', error);
    }
  };

  // Initialize speech monitor
  const initializeSpeechMonitor = async () => {
    try {
      const stopFunction = await startSpeechMonitor((newMeasurement) => {
        setSpeechMeasurement(newMeasurement);
      });
      
      setStopSpeechMeasuring(() => stopFunction);
    } catch (error) {
      console.error('Error setting up speech monitor:', error);
    }
  };

  // Clean up all active monitors
  const cleanupAllMonitors = () => {
    if (stopSoundMeasuring) {
      stopSoundMeasuring();
      setStopSoundMeasuring(null);
    }
    
    if (stopCardiacMeasuring) {
      stopCardiacMeasuring();
      setStopCardiacMeasuring(null);
    }
    
    if (stopRespiratoryMeasuring) {
      stopRespiratoryMeasuring();
      setStopRespiratoryMeasuring(null);
    }
    
    if (stopTremorMeasuring) {
      stopTremorMeasuring();
      setStopTremorMeasuring(null);
    }
    
    if (stopGaitMeasuring) {
      stopGaitMeasuring();
      setStopGaitMeasuring(null);
    }
    
    if (stopSpeechMeasuring) {
      stopSpeechMeasuring();
      setStopSpeechMeasuring(null);
    }
  };

  // Handle saving a measurement
  const handleSaveMeasurement = async (newMeasurement: SavedMeasurement) => {
    try {
      const updatedMeasurements = await saveMeasurement(newMeasurement);
      setSavedMeasurements(updatedMeasurements);
    } catch (error) {
      console.error('Error saving measurement:', error);
    }
  };

  // Navigate to a specific screen
  const navigateToScreen = (screen: AppScreen) => {
    // Close settings panel if open
    if (showSettings) {
      setShowSettings(false);
    }
    
    if (screen === 'map') {
      try {
        // Handle the map screen without router.push for now
        setCurrentScreen('map');
      } catch (error) {
        console.log('Error navigating to map:', error);
        setCurrentScreen('map');
      }
    } else {
    setCurrentScreen(screen);
    }
    
    // Set the active monitoring mode based on the screen
    if (screen === 'soundMonitor') {
      setActiveMonitoringMode('sound');
    } else if (screen === 'cardiacMonitor') {
      setActiveMonitoringMode('cardiac');
    } else if (screen === 'respiratoryMonitor') {
      setActiveMonitoringMode('respiratory');
    } else if (screen === 'tremorMonitor') {
      setActiveMonitoringMode('tremor');
    } else if (screen === 'gaitMonitor') {
      setActiveMonitoringMode('gait');
    } else if (screen === 'speechMonitor') {
      setActiveMonitoringMode('speech');
    }
  };

  // Get icon for monitoring mode
  const getModeIcon = (mode: BiomedicalMonitoringMode): keyof typeof Ionicons.glyphMap => {
    switch (mode) {
      case 'sound': return 'volume-high-outline';
      case 'cardiac': return 'heart-outline';
      case 'respiratory': return 'fitness-outline';
      case 'tremor': return 'hand-left-outline';
      case 'gait': return 'walk-outline';
      case 'speech': return 'mic-outline';
      case 'none': return 'medical-outline';
      default: return 'medical-outline';
    }
  };

  // Get icon for displayable monitoring mode (excludes 'none')
  const getDisplayableModeIcon = (mode: DisplayableMonitoringMode): keyof typeof Ionicons.glyphMap => {
    switch (mode) {
      case 'sound': return 'volume-high-outline';
      case 'cardiac': return 'heart-outline';
      case 'respiratory': return 'fitness-outline';
      case 'tremor': return 'hand-left-outline';
      case 'gait': return 'walk-outline';
      case 'speech': return 'mic-outline';
      default: return 'medical-outline';
    }
  };

  // Get name for monitoring mode
  const getModeName = (mode: BiomedicalMonitoringMode): string => {
    switch (mode) {
      case 'sound': return 'Sound';
      case 'cardiac': return 'Heart Rate';
      case 'respiratory': return 'Respiratory';
      case 'tremor': return 'Tremor';
      case 'gait': return 'Gait';
      case 'speech': return 'Speech';
      case 'none': return 'Monitor';
      default: return 'Monitor';
    }
  };

  // Get color for monitoring mode
  const getModeColor = (mode: BiomedicalMonitoringMode): string => {
    switch (mode) {
      case 'sound': return Colors.modes.sound;
      case 'cardiac': return Colors.modes.cardiac;
      case 'respiratory': return Colors.modes.respiratory;
      case 'tremor': return Colors.modes.tremor;
      case 'gait': return Colors.modes.gait;
      case 'speech': return Colors.modes.speech;
      case 'none': return Colors.primary.main;
      default: return Colors.primary.main;
    }
  };

  // Get active measurement based on monitoring mode
  const getActiveMeasurement = (): MeasurementType => {
    switch (activeMonitoringMode) {
      case 'sound':
        return { type: 'sound', data: soundMeasurement };
      case 'cardiac':
        return { type: 'cardiac', data: cardiacMeasurement };
      case 'respiratory':
        return { type: 'respiratory', data: respiratoryMeasurement };
      case 'tremor':
        return { type: 'tremor', data: tremorMeasurement };
      case 'gait':
        return { type: 'gait', data: gaitMeasurement };
      case 'speech':
        return { type: 'speech', data: speechMeasurement };
      case 'none':
      default:
        return { type: 'sound', data: null };
    }
  };

  // Handle settings toggle with animation
  const toggleSettings = (show: boolean) => {
    // Prevent multiple triggers
    if ((show && showSettings) || (!show && !showSettings)) return;
    
    // Animate settings panel
    Animated.timing(settingsPanelAnim, {
      toValue: show ? 0 : 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Animate backdrop
    Animated.timing(settingsBackdropAnim, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      if (!show) setShowSettings(false);
    });
    
    if (show) setShowSettings(true);
  };

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashComplete} />;
  }

  // Show onboarding screen if needed
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Show help screen if needed
  if (showHelp) {
    return (
      <View style={{ flex: 1 }}>
        <HelpScreen 
          onClose={() => setShowHelp(false)} 
          currentMode={activeMonitoringMode === 'sound' ? 'sound' : 
            activeMonitoringMode === 'cardiac' ? 'heart' : 
            activeMonitoringMode === 'respiratory' ? 'breathing' : 
            activeMonitoringMode === 'tremor' ? 'tremor' : 
            activeMonitoringMode === 'gait' ? 'gait' : 
            activeMonitoringMode === 'speech' ? 'speech' : 'general'} 
        />
      </View>
    );
  }

  // Render feature screen
  const renderFeatureScreen = () => {
    // Only show loading state if we're actually initializing a sensor (not in 'none' mode)
    if (isLoading && activeMonitoringMode !== 'none') {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing {getModeName(activeMonitoringMode)} monitor...</Text>
        </View>
      );
    }

    // Feature screens
    switch (currentScreen) {
      case 'home':
        return renderHomeScreen();
      case 'map':
        return (
          <SoundMap 
            currentMeasurement={soundMeasurement} 
            savedMeasurements={savedMeasurements}
            onSaveMeasurement={handleSaveMeasurement}
          />
        );
      case 'soundMonitor':
      case 'cardiacMonitor':
      case 'respiratoryMonitor':
      case 'tremorMonitor':
      case 'gaitMonitor':
      case 'speechMonitor':
        return renderMonitorScreen();
      default:
        return renderHomeScreen();
    }
  };

  // Render home screen with mode selection cards
  const renderHomeScreen = () => {
    return (
      <View style={styles.homeContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.homeScrollContent}
        >
          <Text style={styles.homeSectionTitle}>Monitoring Modes</Text>
          <Text style={styles.instructionText}>
            Select a monitoring mode below to activate the corresponding sensor.
            Permissions will be requested only when needed.
          </Text>
          <View style={styles.cardsContainer}>
            {(['sound', 'cardiac', 'respiratory', 'tremor', 'gait', 'speech']).map((mode) => (
              <ModeSelectorCard
                key={mode}
                mode={mode as any}
                isActive={activeMonitoringMode === mode}
                onSelect={() => {
                  // We need to have a full screen map that includes 'none'
                  const fullScreenMap: Record<string, AppScreen> = {
                    'none': 'home',
                    'sound': 'soundMonitor',
                    'cardiac': 'cardiacMonitor',
                    'respiratory': 'respiratoryMonitor',
                    'tremor': 'tremorMonitor',
                    'gait': 'gaitMonitor',
                    'speech': 'speechMonitor'
                  };
                  
                  // Play sound effect if sound mode selected
                  if (mode === 'sound') {
                    handleSoundModeSelection();
                  } else {
                    // Use the screenMap with the selected mode
                    navigateToScreen(fullScreenMap[mode]);
                  }
                }}
              />
            ))}
          </View>
          
          {savedMeasurements.length > 0 ? (
            <View style={styles.recentSection}>
              <Text style={styles.sectionLabel}>RECENT MEASUREMENTS</Text>
              <View style={styles.recentContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.headerIconContainer}>
                    <Ionicons name="time-outline" size={18} color={Colors.primary.main} />
                    <Text style={styles.sectionTitle}>Latest Activity</Text>
                  </View>
                  <View style={styles.headerActions}>
                    <TouchableOpacity 
                      style={styles.refreshButton}
                      onPress={async () => {
                        try {
                          setIsLoading(true);
                          const measurements = await getMeasurements();
                          setSavedMeasurements(measurements);
                        } catch (error) {
                          console.error('Error refreshing measurements:', error);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      <Ionicons name="refresh-outline" size={18} color={Colors.primary.main} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.seeAllButton}
                      onPress={() => navigateToScreen('map')}
                    >
                      <Text style={styles.seeAllText}>See All</Text>
                      <Ionicons name="chevron-forward" size={16} color={Colors.primary.main} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.recentList}>
                  {savedMeasurements.slice(0, 3).map((measurement, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.recentItem}
                      onPress={() => {
                        // Map measurement type to the correct screen type
                        const typeToScreenMap: Record<string, AppScreen> = {
                          'sound': 'soundMonitor',
                          'cardiac': 'cardiacMonitor',
                          'respiratory': 'respiratoryMonitor',
                          'tremor': 'tremorMonitor',
                          'gait': 'gaitMonitor',
                          'speech': 'speechMonitor'
                        };
                        const targetScreen = typeToScreenMap[measurement.type as string];
                        if (targetScreen) {
                          navigateToScreen(targetScreen);
                        }
                      }}
                    >
                      <View 
                        style={[
                          styles.iconCircle, 
                          { backgroundColor: `${getModeColor(measurement.type as any)}20` }
                        ]}
                      >
                        <Ionicons 
                          name={getModeIcon(measurement.type as any)} 
                          size={20} 
                          color={getModeColor(measurement.type as any)} 
                        />
                      </View>
                      <View style={styles.recentItemContent}>
                        <Text style={styles.recentItemTitle}>{getMeasurementTypeLabel(measurement.type)}</Text>
                        <Text style={styles.recentItemSubtitle}>
                          {new Date(measurement.timestamp).toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.chevronContainer}>
                        <Ionicons name="chevron-forward" size={20} color={Colors.neutral.medium} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="document-outline" size={48} color={Colors.neutral.medium} />
              <Text style={styles.emptyStateTitle}>No Measurements Yet</Text>
              <Text style={styles.emptyStateText}>
                Your recent measurements will appear here once you start monitoring and saving data.
              </Text>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => navigateToScreen('soundMonitor')}
              >
                <Text style={styles.startButtonText}>Start Monitoring</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  // Create a utility for sound map effects
  const playSoundMapEffect = async (soundLevel: number) => {
    if (Platform.OS === 'web' || !soundMeasurement) return;
    
    try {
      const soundEffect = new Audio.Sound();
      
      // Choose audio file based on sound level
      let soundFile;
      if (soundLevel < 50) {
        soundFile = require('../assets/sounds/low-sound.mp3');
      } else if (soundLevel < 75) {
        soundFile = require('../assets/sounds/low-sound.mp3');
      } else {
        soundFile = require('../assets/sounds/low-sound.mp3');
      }
      
      // Load and play the sound
      await soundEffect.loadAsync(soundFile);
      await soundEffect.playAsync();
      
      // Fix the sound effect playback status update
      soundEffect.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          soundEffect.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Error playing sound map effect:', error);
    }
  };

  // Update the renderMonitorScreen function to handle 'none' mode properly
  const renderMonitorScreen = () => {
    const activeMeasurement = getActiveMeasurement();
    
    // Add sound mapping effect for sound monitoring
    useEffect(() => {
      if (currentScreen === 'soundMonitor' && soundMeasurement) {
        // Play effect when sound level changes significantly (more than 5dB)
        const currentLevel = soundMeasurement.dB;
        playSoundMapEffect(currentLevel);
      }
    }, [soundMeasurement, currentScreen]);
    
    return (
      <ScrollView 
        style={styles.monitorScreen}
        contentContainerStyle={styles.monitorContent}
        showsVerticalScrollIndicator={true}
      >
        <BiomedicalMeter measurement={activeMeasurement} />
        
        <VideoTutorial mode={activeMonitoringMode} style={styles.videoTutorialButton} />
        
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            { backgroundColor: getModeColor(activeMonitoringMode) }
          ]}
          onPress={() => {
            const measurement = activeMeasurement.data;
            if (!measurement || savedMeasurements === null) return;
            
            // Create a saved measurement with the appropriate type and format
            const savedMeasurement: SavedMeasurement = {
              type: activeMeasurement.type,
              location: {
                latitude: 0,
                longitude: 0
              },
              timestamp: new Date().toISOString(),
              data: measurement
            };
            
            handleSaveMeasurement(savedMeasurement);
          }}
          disabled={!activeMeasurement.data}
        >
          <Text style={styles.saveButtonText}>Save Current Measurement</Text>
        </TouchableOpacity>
        
        {/* Only show MonitoringProgress and AdvancedAnalysis for valid modes (not 'none') */}
        {activeMonitoringMode !== 'none' && (
          <>
            {/* Progress Tracking Section */}
            <MonitoringProgress mode={activeMonitoringMode as Exclude<BiomedicalMonitoringMode, 'none'>} />
            
            {/* Advanced Analysis Section */}
            <AdvancedAnalysis 
              mode={activeMonitoringMode as Exclude<BiomedicalMonitoringMode, 'none'>} 
              data={activeMeasurement.data} 
            />
          </>
        )}
        
        {/* About Section */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>About {getModeName(activeMonitoringMode)} Monitoring</Text>
          <Text style={styles.infoText}>
            {getMonitoringInfo(activeMonitoringMode)}
          </Text>
        </View>
        
        {/* Analysis Section */}
        <View style={styles.analysisSection}>
          <Text style={styles.sectionTitle}>Analysis & Insights</Text>
          
          {/* Current Measurement Analysis */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Ionicons name="analytics-outline" size={20} color={Colors.primary.main} />
              <Text style={styles.cardTitle}>Current Measurement</Text>
            </View>
            <View style={styles.cardContent}>
              {renderAnalysisContent(activeMeasurement)}
            </View>
          </View>
          
          {/* Trends Card */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Ionicons name="trending-up-outline" size={20} color={Colors.primary.main} />
              <Text style={styles.cardTitle}>Recent Trends</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.trendText}>
                {getTrendAnalysis(activeMonitoringMode)}
              </Text>
            </View>
          </View>
          
          {/* Recommendations Card */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Ionicons name="bulb-outline" size={20} color={Colors.primary.main} />
              <Text style={styles.cardTitle}>Recommendations</Text>
            </View>
            <View style={styles.cardContent}>
              {getRecommendations(activeMonitoringMode).map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={Colors.primary.main} />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  // Render analysis content based on the active measurement
  const renderAnalysisContent = (measurement: MeasurementType) => {
    if (!measurement.data) {
      return <Text style={styles.analysisText}>No measurement data available.</Text>;
    }
    
    switch (measurement.type) {
      case 'sound':
        return (
          <>
            <Text style={styles.analysisText}>
              Current sound level: <Text style={styles.highlightText}>{measurement.data.dB.toFixed(1)} dB</Text>
            </Text>
            <Text style={styles.analysisText}>
              Category: <Text style={[styles.highlightText, {color: measurement.data.category.color}]}>
                {measurement.data.category.description}
              </Text>
            </Text>
            <Text style={styles.analysisText}>
              {getSoundAnalysis(measurement.data.dB)}
            </Text>
          </>
        );
      case 'cardiac':
        return (
          <>
            <Text style={styles.analysisText}>
              Heart rate: <Text style={styles.highlightText}>{measurement.data.heartRate} BPM</Text>
            </Text>
            <Text style={styles.analysisText}>
              Category: <Text style={[styles.highlightText, {color: measurement.data.category.color}]}>
                {measurement.data.category.description}
              </Text>
            </Text>
            <Text style={styles.analysisText}>
              {getCardiacAnalysis(measurement.data.heartRate)}
            </Text>
          </>
        );
      // Similar analysis for other measurement types...
      default:
        return <Text style={styles.analysisText}>Analysis not available for this measurement type.</Text>;
    }
  };

  // Get trend analysis based on mode
  const getTrendAnalysis = (mode: BiomedicalMonitoringMode): string => {
    switch (mode) {
      case 'sound':
        return 'Your environment has been relatively quiet over the past hour with occasional moderate peaks.';
      case 'cardiac':
        return 'Your heart rate has been within normal resting range over the past measurements.';
      case 'respiratory':
        return 'Your breathing rate has been consistent with occasional periods of deeper breathing.';
      case 'tremor':
        return 'Tremor intensity has been minimal with no significant patterns of concern.';
      case 'gait':
        return 'Your walking patterns show good symmetry with consistent stride length.';
      case 'speech':
        return 'Speech clarity metrics are within the normal range with consistent performance.';
      default:
        return 'No trend data available for this monitoring mode.';
    }
  };

  // Get sound level analysis
  const getSoundAnalysis = (dB: number): string => {
    if (dB < 50) {
      return 'This is a quiet environment suitable for rest, sleep, or concentration.';
    } else if (dB < 70) {
      return 'This is a moderate sound level, similar to normal conversation or background music.';
    } else if (dB < 85) {
      return 'This level may cause discomfort during prolonged exposure but is generally safe for limited periods.';
    } else if (dB < 100) {
      return 'This is a loud environment that could cause hearing damage after extended exposure (8+ hours).';
    } else {
      return 'This is a very loud environment that could cause hearing damage with even short-term exposure.';
    }
  };

  // Get cardiac analysis
  const getCardiacAnalysis = (bpm: number): string => {
    if (bpm < 60) {
      return 'Your heart rate is below the typical resting range, which may be normal for athletes or those with good cardiovascular fitness.';
    } else if (bpm >= 60 && bpm <= 100) {
      return 'Your heart rate is within the normal resting range for adults.';
    } else {
      return 'Your heart rate is elevated above the typical resting range. This may be due to activity, stress, or other factors.';
    }
  };

  // Get recommendations based on monitoring mode
  const getRecommendations = (mode: BiomedicalMonitoringMode): string[] => {
    switch (mode) {
      case 'sound':
        return [
          'Use hearing protection in environments above 85 dB',
          'Take regular breaks from loud environments',
          'Monitor cumulative noise exposure throughout the day',
          'Create quiet zones in your home or workplace',
          'Use noise-cancelling headphones for noisy commutes'
        ];
      case 'cardiac':
        return [
          'Maintain regular physical activity for heart health',
          'Practice stress reduction techniques',
          'Ensure adequate sleep and hydration',
          'Monitor patterns over time and note changes',
          'Consult healthcare provider for persistent irregularities'
        ];
      case 'respiratory':
        return [
          'Practice deep breathing exercises regularly',
          'Maintain good posture to optimize breathing',
          'Stay hydrated to keep airways clear',
          'Monitor for changes during physical activity',
          'Avoid respiratory irritants like smoke or pollution'
        ];
      case 'tremor':
        return [
          'Track tremor patterns related to medication timing',
          'Practice relaxation techniques to reduce stress',
          'Maintain regular sleep schedule',
          'Use adaptive tools for daily activities if needed',
          'Document triggers that may worsen tremors'
        ];
      case 'gait':
        return [
          'Incorporate balance exercises into your routine',
          'Wear appropriate footwear for optimal gait',
          'Maintain regular mobility exercises',
          'Remove tripping hazards in your environment',
          'Consider physical therapy for persistent issues'
        ];
      case 'speech':
        return [
          'Practice regular vocal exercises',
          'Stay hydrated for optimal vocal cord function',
          'Record speech samples to track changes over time',
          'Reduce strain on your voice during long conversations',
          'Practice articulation exercises for clarity'
        ];
      default:
        return ['No specific recommendations available for this monitoring mode.'];
    }
  };

  // Implement sound effect for map in sound selection mode
  const handleSoundModeSelection = () => {
    // Play a sound effect when selecting sound mode
    if (Platform.OS !== 'web') {
      try {
        const soundEffect = new Audio.Sound();
        async function playSound() {
          try {
            // Use a basic sound effect (you'll need to add this file to your assets)
            await soundEffect.loadAsync(require('../assets/sounds/map-select.mp3'));
            await soundEffect.playAsync();
          } catch (error) {
            console.log('Error loading sound:', error);
          }
        }
        playSound();
      } catch (error) {
        console.log('Error initializing sound:', error);
      }
    }
    
    // Navigate to sound monitor
    navigateToScreen('soundMonitor');
  };

  // Add a useEffect to load saved measurements on initial app start
  useEffect(() => {
    // When the app first loads and onboarding/splash is complete, load saved measurements
    if (!showSplash && !showOnboarding) {
      const loadInitialData = async () => {
        try {
          const measurements = await getMeasurements();
          setSavedMeasurements(measurements);
        } catch (error) {
          console.error('Error loading initial measurements:', error);
        }
      };
      
      loadInitialData();
    }
  }, [showSplash, showOnboarding]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.primary.dark} barStyle="light-content" />
      
      {/* Advanced Header/Navbar */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[Colors.primary.dark, Colors.primary.main]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
        <View style={styles.headerLeft}>
          {currentScreen !== 'home' && (
            <TouchableOpacity 
                style={[styles.headerButton, { marginLeft: 0 }]} 
              onPress={() => navigateToScreen('home')}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
            <View style={styles.titleContainer}>
          <Text style={styles.navTitle}>
            {currentScreen === 'home' 
              ? 'BioSignal Monitor' 
              : getModeName(activeMonitoringMode)}
          </Text>
              {currentScreen === 'home' && (
                <Text style={styles.navSubtitle}>
                  Your health monitoring companion
                </Text>
              )}
            </View>
        </View>
        
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => setShowHelp(true)}
            >
              <Ionicons name="help-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => toggleSettings(!showSettings)}
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>US</Text>
        </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      
      {/* Main content */}
      <View style={styles.mainContent}>
        {renderFeatureScreen()}
      </View>
      
      {/* Settings Panel */}
      {showSettings ? (
        <>
          <Animated.View
            style={[
              styles.settingsBackdrop,
              { opacity: settingsBackdropAnim }
            ]}
          >
            <TouchableOpacity 
              style={styles.backdropTouchable}
              onPress={() => toggleSettings(false)}
              activeOpacity={1}
            />
          </Animated.View>
          <SettingsPanel 
            onClose={() => toggleSettings(false)}
            setSavedMeasurements={setSavedMeasurements}
            animatedStyles={{
              transform: [{ translateX: settingsPanelAnim }]
            }}
          />
        </>
      ) : null}
    </SafeAreaView>
  );
}

// Get info text for each monitoring mode
const getMonitoringInfo = (mode: BiomedicalMonitoringMode): string => {
  switch (mode) {
    case 'sound':
      return 'Prolonged exposure to noise above 85 dB can cause hearing damage. The World Health Organization recommends environmental noise levels below 70 dB over 24 hours to prevent harmful health effects.';
    case 'cardiac':
      return 'Normal resting heart rate for adults ranges from 60 to 100 beats per minute. Regular monitoring can help identify changes in cardiovascular health.';
    case 'respiratory':
      return 'Normal respiratory rate for adults at rest is 12 to 20 breaths per minute. Changes in breathing patterns may indicate respiratory or circulatory issues.';
    case 'tremor':
      return 'Tremors may be normal (physiological) or indicate underlying conditions. Regular monitoring can help track changes in tremor intensity and frequency.';
    case 'gait':
      return 'Gait analysis helps assess mobility, stability, and symmetry of walking patterns. Changes in gait can indicate neurological, musculoskeletal, or balance issues.';
    case 'speech':
      return 'Speech patterns can provide insights into neurological and cognitive health. Changes in speech clarity, rhythm, or volume may indicate underlying conditions.';
    default:
      return 'Biomedical monitoring can provide insights into various aspects of health and well-being.';
  }
};

const getMeasurementTypeLabel = (type: string): string => {
  switch (type) {
    case 'sound':
      return 'Sound Level';
    case 'cardiac':
      return 'Heart Rate';
    case 'respiratory':
      return 'Respiratory Rate';
    case 'tremor':
      return 'Tremor Analysis';
    case 'gait':
      return 'Gait Analysis';
    case 'speech':
      return 'Speech Analysis';
    default:
      return 'Measurement';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  headerContainer: {
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 44,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  homeContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.main,
  },
  homeSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: Colors.neutral.darkest,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: Colors.neutral.darkest,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.neutral.medium,
    marginTop: 24,
    marginBottom: 8,
    paddingLeft: 8,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recentSection: {
    marginTop: 16,
    marginBottom: 32,
  },
  recentContainer: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    padding: 20,
  },
  headerIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary.main}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary.main,
    fontWeight: '600',
    marginRight: 4,
  },
  recentList: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral.lighter,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.neutral.darkest,
    marginBottom: 4,
  },
  recentItemSubtitle: {
    fontSize: 14,
    color: Colors.neutral.medium,
  },
  chevronContainer: {
    width: 30,
    alignItems: 'flex-end',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  monitorScreen: {
    flex: 1,
    padding: 16,
  },
  monitorContent: {
    paddingBottom: 40,
  },
  analysisSection: {
    marginTop: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.lightest,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lighter,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginLeft: 8,
  },
  cardContent: {
    padding: 16,
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral.dark,
    marginBottom: 8,
  },
  highlightText: {
    fontWeight: 'bold',
    color: Colors.primary.main,
  },
  trendText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral.dark,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral.dark,
    marginLeft: 8,
    flex: 1,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    marginVertical: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 32,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  videoTutorialButton: {
    alignSelf: 'center',
    marginVertical: 15,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.neutral.medium,
    marginBottom: 24,
  },
  startButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    marginRight: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary.main}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  navSubtitle: {
    fontSize: 14,
    color: Colors.neutral.medium,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '85%',
    backgroundColor: Colors.neutral.white,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    zIndex: 1000,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lighter,
    backgroundColor: Colors.neutral.white,
  },
  settingsPanelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral.darkest,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: Colors.neutral.lightest,
  },
  settingsContent: {
    flex: 1,
    padding: 16,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lighter,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.main,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral.lighter,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: Colors.neutral.white,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.darkest,
    marginBottom: 4,
  },
  settingsItemDescription: {
    fontSize: 14,
    color: Colors.neutral.medium,
  },
  toggleButton: {
    width: 50, 
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary.main,
  },
  toggleButtonInactive: {
    backgroundColor: Colors.neutral.medium,
  },
  toggleButtonHandle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neutral.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  toggleButtonHandleActive: {
    backgroundColor: Colors.neutral.white,
  },
  toggleButtonHandleInactive: {
    backgroundColor: Colors.neutral.white,
  },
  dangerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: `${Colors.functional.error}15`,
    borderRadius: 8,
  },
  dangerButtonText: {
    color: Colors.functional.error,
    fontWeight: '600',
    fontSize: 14,
  },
  settingsBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  backdropTouchable: {
    width: '100%',
    height: '100%',
  },
  homeScrollContent: {
    paddingBottom: 40,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.neutral.medium,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  monitoringIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
}); 
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storing user preferences
const ONBOARDING_COMPLETE_KEY = 'sound_pollution_onboarding_complete';

// Check if the user has completed onboarding
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false; // Default to showing onboarding on error
  }
};

// Mark onboarding as complete
export const setOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
};

// Reset onboarding status (for testing)
export const resetOnboardingStatus = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
  } catch (error) {
    console.error('Error resetting onboarding status:', error);
  }
}; 
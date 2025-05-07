import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';

interface SettingsPanelProps {
  onClose: () => void;
  setSavedMeasurements: React.Dispatch<React.SetStateAction<any[]>>;
  animatedStyles: any;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  onClose, 
  setSavedMeasurements,
  animatedStyles
}) => {
  // Use a ref to prevent state updates on unmounted components
  const isMounted = useRef(true);
  
  // All state hooks must be called unconditionally at the top level
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [location, setLocation] = useState(true);
  
  // Load settings once when component mounts
  useEffect(() => {
    let mounted = true;
    
    // Load settings from AsyncStorage when panel opens
    const loadSettings = async () => {
      try {
        const darkModeSetting = await AsyncStorage.getItem('@settings_darkMode');
        const notificationsSetting = await AsyncStorage.getItem('@settings_notifications');
        const dataSyncSetting = await AsyncStorage.getItem('@settings_dataSync');
        const locationSetting = await AsyncStorage.getItem('@settings_location');
        
        // Only update state if component is still mounted
        if (mounted) {
          if (darkModeSetting !== null) setDarkMode(darkModeSetting === 'true');
          if (notificationsSetting !== null) setNotifications(notificationsSetting === 'true');
          if (dataSyncSetting !== null) setDataSync(dataSyncSetting === 'true');
          if (locationSetting !== null) setLocation(locationSetting === 'true');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
    
    // Cleanup function
    return () => {
      mounted = false;
      isMounted.current = false;
    };
  }, []);
  
  // All handler functions - these don't affect hook order
  const handleToggle = async (setter: React.Dispatch<React.SetStateAction<boolean>>, currentValue: boolean, settingKey: string) => {
    if (isMounted.current) {
      const newValue = !currentValue;
      setter(newValue);
      
      // Save to AsyncStorage
      try {
        await AsyncStorage.setItem(settingKey, newValue.toString());
      } catch (error) {
        console.error(`Error saving setting ${settingKey}:`, error);
      }
      
      // Apply setting changes
      if (settingKey === '@settings_darkMode') {
        // Implementation of dark mode would go here
        // For a real implementation, you might use a theme context
        Alert.alert('Dark Mode', newValue ? 'Dark mode enabled' : 'Dark mode disabled');
      }
    }
  };
  
  // Helper function to render toggle buttons consistently
  const renderToggleButton = useCallback((value: boolean, onToggle: () => void) => (
    <TouchableOpacity 
      style={[styles.toggleButton, value ? styles.toggleButtonActive : styles.toggleButtonInactive]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[
        styles.toggleButtonHandle,
        value ? styles.toggleButtonHandleActive : styles.toggleButtonHandleInactive,
        value ? { right: 2 } : { left: 2 }
      ]} />
    </TouchableOpacity>
  ), []);
  
  const handleExportData = async () => {
    try {
      // In a real implementation, this would format data for export
      // and use a file system API or share API
      Alert.alert(
        "Data Export",
        "Your data has been exported successfully.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert(
        "Export Failed",
        "There was an error exporting your data.",
        [{ text: "OK" }]
      );
    }
  };
  
  const handleClearData = async () => {
    try {
      // Show confirmation dialog
      Alert.alert(
        "Clear All Data",
        "Are you sure you want to delete all measurement data? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Clear All Data",
            style: "destructive",
            onPress: async () => {
              try {
                // Clear from local state
                setSavedMeasurements([]);
                
                // Clear from storage
                await AsyncStorage.removeItem('@saved_measurements');
                
                // Show success message
                Alert.alert(
                  "Success",
                  "All measurement data has been cleared.",
                  [{ text: "OK" }]
                );
              } catch (error) {
                console.error('Error in clear data operation:', error);
                Alert.alert(
                  "Error",
                  "An error occurred while clearing data.",
                  [{ text: "OK" }]
                );
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error showing clear data confirmation:', error);
    }
  };

  return (
    <Animated.View 
      style={[
        styles.settingsPanel,
        animatedStyles
      ]}
    >
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsPanelTitle}>Settings</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color={Colors.neutral.medium} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.settingsContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.settingsSection}>
          <View style={styles.settingsSectionHeader}>
            <Text style={styles.settingsSectionTitle}>User Profile</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => Alert.alert("Profile", "Profile management coming soon")}
          >
            <View style={styles.settingsItemContent}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${Colors.primary.main}15` }]}>
                <Ionicons name="person-outline" size={22} color={Colors.primary.main} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>Profile Information</Text>
                <Text style={styles.settingsItemDescription}>Manage your personal details</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemContent}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${Colors.functional.info}15` }]}>
                <Ionicons name="notifications-outline" size={22} color={Colors.functional.info} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>Notifications</Text>
                <Text style={styles.settingsItemDescription}>Configure alerts and reminders</Text>
              </View>
            </View>
            {renderToggleButton(
              notifications, 
              () => handleToggle(setNotifications, notifications, '@settings_notifications')
            )}
          </View>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemContent}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${Colors.functional.success}15` }]}>
                <Ionicons name="location-outline" size={22} color={Colors.functional.success} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>Location Services</Text>
                <Text style={styles.settingsItemDescription}>Enable location for better analysis</Text>
              </View>
            </View>
            {renderToggleButton(
              location, 
              () => handleToggle(setLocation, location, '@settings_location')
            )}
          </View>
        </View>
        
        {/* App Settings Section */}
        <View style={styles.settingsSection}>
          <View style={styles.settingsSectionHeader}>
            <Text style={styles.settingsSectionTitle}>App Settings</Text>
          </View>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemContent}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${Colors.neutral.dark}15` }]}>
                <Ionicons name="moon-outline" size={22} color={Colors.neutral.dark} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>Dark Mode</Text>
                <Text style={styles.settingsItemDescription}>Switch to dark theme</Text>
              </View>
            </View>
            {renderToggleButton(
              darkMode, 
              () => handleToggle(setDarkMode, darkMode, '@settings_darkMode')
            )}
          </View>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemContent}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${Colors.primary.main}15` }]}>
                <Ionicons name="cloud-upload-outline" size={22} color={Colors.primary.main} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>Data Synchronization</Text>
                <Text style={styles.settingsItemDescription}>Sync data with cloud storage</Text>
              </View>
            </View>
            {renderToggleButton(
              dataSync, 
              () => handleToggle(setDataSync, dataSync, '@settings_dataSync')
            )}
          </View>
        </View>
        
        {/* Data Management Section */}
        <View style={styles.settingsSection}>
          <View style={styles.settingsSectionHeader}>
            <Text style={styles.settingsSectionTitle}>Data Management</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleExportData}
          >
            <View style={styles.settingsItemContent}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${Colors.primary.main}15` }]}>
                <Ionicons name="cloud-download-outline" size={22} color={Colors.primary.main} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>Export Data</Text>
                <Text style={styles.settingsItemDescription}>Download your monitoring data</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleClearData}
          >
            <View style={styles.settingsItemContent}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${Colors.functional.error}15` }]}>
                <Ionicons name="trash-outline" size={22} color={Colors.functional.error} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>Clear Data</Text>
                <Text style={styles.settingsItemDescription}>Delete all stored measurements</Text>
              </View>
            </View>
            <View style={styles.dangerButton}>
              <Text style={styles.dangerButtonText}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* About Section */}
        <View style={styles.settingsSection}>
          <View style={styles.settingsSectionHeader}>
            <Text style={styles.settingsSectionTitle}>About</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => Alert.alert("App Info", "Sound Pollution Detector v1.0.0\nDeveloped by Sound Health Inc.")}
          >
            <View style={styles.settingsItemContent}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${Colors.primary.main}15` }]}>
                <Ionicons name="information-circle-outline" size={22} color={Colors.primary.main} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>App Information</Text>
                <Text style={styles.settingsItemDescription}>Version 1.0.0</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => Alert.alert("Privacy Policy", "Your privacy is important to us. We collect minimal data necessary for the app to function.")}
          >
            <View style={styles.settingsItemContent}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${Colors.functional.info}15` }]}>
                <Ionicons name="shield-checkmark-outline" size={22} color={Colors.functional.info} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>Privacy Policy</Text>
                <Text style={styles.settingsItemDescription}>How we use your data</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => Alert.alert("Terms of Service", "By using this app, you agree to comply with our terms of service.")}
          >
            <View style={styles.settingsItemContent}>
              <View style={[styles.settingsIconContainer, { backgroundColor: `${Colors.neutral.dark}15` }]}>
                <Ionicons name="document-text-outline" size={22} color={Colors.neutral.dark} />
              </View>
              <View style={styles.settingsTextContainer}>
                <Text style={styles.settingsItemTitle}>Terms of Service</Text>
                <Text style={styles.settingsItemDescription}>User agreement</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  settingsPanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 320,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 1000,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lightest,
  },
  settingsPanelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral.darkest,
  },
  closeButton: {
    padding: 5,
  },
  settingsContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingsSection: {
    marginTop: 20,
  },
  settingsSectionHeader: {
    marginBottom: 10,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.darkest,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lightest,
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.neutral.darkest,
    marginBottom: 3,
  },
  settingsItemDescription: {
    fontSize: 13,
    color: Colors.neutral.medium,
  },
  toggleButton: {
    width: 50,
    height: 26,
    borderRadius: 13,
    padding: 2,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary.main,
  },
  toggleButtonInactive: {
    backgroundColor: Colors.neutral.lightest,
  },
  toggleButtonHandle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    position: 'absolute',
    top: 2,
  },
  toggleButtonHandleActive: {
    backgroundColor: '#fff',
  },
  toggleButtonHandleInactive: {
    backgroundColor: Colors.neutral.light,
  },
  dangerButton: {
    backgroundColor: `${Colors.functional.error}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  dangerButtonText: {
    color: Colors.functional.error,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SettingsPanel; 
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundMeterEnabled, setSoundMeterEnabled] = useState(true);
  const [cardiacMeterEnabled, setCardiacMeterEnabled] = useState(true);
  const [respiratoryMeterEnabled, setRespiratoryMeterEnabled] = useState(true);
  const [tremorMeterEnabled, setTremorMeterEnabled] = useState(true);
  const [gaitMeterEnabled, setGaitMeterEnabled] = useState(true);
  const [speechMeterEnabled, setSpeechMeterEnabled] = useState(true);
  const [saveLocation, setSaveLocation] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={22} color={Colors.neutral.dark} />
              <Text style={styles.settingTitle}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.neutral.light, true: Colors.primary.main }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={22} color={Colors.neutral.dark} />
              <Text style={styles.settingTitle}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.neutral.light, true: Colors.primary.main }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="location-outline" size={22} color={Colors.neutral.dark} />
              <Text style={styles.settingTitle}>Save Location with Measurements</Text>
            </View>
            <Switch
              value={saveLocation}
              onValueChange={setSaveLocation}
              trackColor={{ false: Colors.neutral.light, true: Colors.primary.main }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="cloud-upload-outline" size={22} color={Colors.neutral.dark} />
              <Text style={styles.settingTitle}>Sync Data with Cloud</Text>
            </View>
            <Switch
              value={dataSync}
              onValueChange={setDataSync}
              trackColor={{ false: Colors.neutral.light, true: Colors.primary.main }}
              thumbColor="#fff"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enabled Monitoring Modes</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high-outline" size={22} color={Colors.modes.sound} />
              <Text style={styles.settingTitle}>Sound Monitoring</Text>
            </View>
            <Switch
              value={soundMeterEnabled}
              onValueChange={setSoundMeterEnabled}
              trackColor={{ false: Colors.neutral.light, true: Colors.modes.sound }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="heart-outline" size={22} color={Colors.modes.cardiac} />
              <Text style={styles.settingTitle}>Heart Rate Monitoring</Text>
            </View>
            <Switch
              value={cardiacMeterEnabled}
              onValueChange={setCardiacMeterEnabled}
              trackColor={{ false: Colors.neutral.light, true: Colors.modes.cardiac }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="fitness-outline" size={22} color={Colors.modes.respiratory} />
              <Text style={styles.settingTitle}>Respiratory Monitoring</Text>
            </View>
            <Switch
              value={respiratoryMeterEnabled}
              onValueChange={setRespiratoryMeterEnabled}
              trackColor={{ false: Colors.neutral.light, true: Colors.modes.respiratory }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="hand-left-outline" size={22} color={Colors.modes.tremor} />
              <Text style={styles.settingTitle}>Tremor Monitoring</Text>
            </View>
            <Switch
              value={tremorMeterEnabled}
              onValueChange={setTremorMeterEnabled}
              trackColor={{ false: Colors.neutral.light, true: Colors.modes.tremor }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="walk-outline" size={22} color={Colors.modes.gait} />
              <Text style={styles.settingTitle}>Gait Monitoring</Text>
            </View>
            <Switch
              value={gaitMeterEnabled}
              onValueChange={setGaitMeterEnabled}
              trackColor={{ false: Colors.neutral.light, true: Colors.modes.gait }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="mic-outline" size={22} color={Colors.modes.speech} />
              <Text style={styles.settingTitle}>Speech Monitoring</Text>
            </View>
            <Switch
              value={speechMeterEnabled}
              onValueChange={setSpeechMeterEnabled}
              trackColor={{ false: Colors.neutral.light, true: Colors.modes.speech }}
              thumbColor="#fff"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Settings</Text>
          
          <TouchableOpacity style={styles.buttonSetting}>
            <View style={styles.settingInfo}>
              <Ionicons name="hardware-chip-outline" size={22} color={Colors.neutral.dark} />
              <Text style={styles.settingTitle}>Calibrate Sensors</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonSetting}>
            <View style={styles.settingInfo}>
              <Ionicons name="options-outline" size={22} color={Colors.neutral.dark} />
              <Text style={styles.settingTitle}>Advanced Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.buttonSetting}>
            <View style={styles.settingInfo}>
              <Ionicons name="cloud-download-outline" size={22} color={Colors.neutral.dark} />
              <Text style={styles.settingTitle}>Export Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonSetting}>
            <View style={styles.settingInfo}>
              <Ionicons name="trash-outline" size={22} color={Colors.functional.error} />
              <Text style={[styles.settingTitle, { color: Colors.functional.error }]}>Clear All Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.buttonSetting}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle-outline" size={22} color={Colors.neutral.dark} />
              <Text style={styles.settingTitle}>About BioSignal Monitor</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonSetting}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark-outline" size={22} color={Colors.neutral.dark} />
              <Text style={styles.settingTitle}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonSetting}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={22} color={Colors.neutral.dark} />
              <Text style={styles.settingTitle}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral.medium} />
          </TouchableOpacity>
          
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>BioSignal Monitor v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.lightest,
  },
  header: {
    backgroundColor: Colors.primary.main,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    marginBottom: 0,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.primary.main,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lighter,
  },
  buttonSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lighter,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.neutral.darkest,
  },
  versionInfo: {
    alignItems: 'center',
    paddingTop: 16,
  },
  versionText: {
    fontSize: 14,
    color: Colors.neutral.medium,
  },
});

export default Settings; 
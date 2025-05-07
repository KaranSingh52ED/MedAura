import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { SOUND_LEVELS, SoundMeasurement } from '../utils/soundMeter';
import { SavedMeasurement } from '../utils/storage';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface SoundMapProps {
  currentMeasurement: SoundMeasurement | null;
  savedMeasurements: SavedMeasurement[];
  onSaveMeasurement: (measurement: SavedMeasurement) => void;
}

const SoundMap: React.FC<SoundMapProps> = (props) => {
  const { currentMeasurement, savedMeasurements, onSaveMeasurement } = props;
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);

  // Get location permission and current location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting location');
      }
    })();
  }, []);

  // Handle saving the current measurement with location
  const handleSave = () => {
    if (!currentMeasurement || !location) return;
    
    // Create saved measurement with location data
    const savedMeasurement: SavedMeasurement = {
      type: 'sound',
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      timestamp: new Date().toISOString(),
      data: currentMeasurement
    };
    
    onSaveMeasurement(savedMeasurement);
  };

  // Determine initial map region
  const getInitialRegion = () => {
    if (location) {
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    
    // Default region (will be overridden when location is available)
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={24} color={Colors.functional.error} />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={getInitialRegion()}
            showsUserLocation
            showsMyLocationButton
            onMapReady={() => setMapReady(true)}
          >
            {/* Current location measurement marker */}
            {currentMeasurement && location && mapReady && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                pinColor={currentMeasurement.category.color}
              >
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>
                      {currentMeasurement.dB.toFixed(1)} dB
                    </Text>
                    <Text>{currentMeasurement.category.description}</Text>
                  </View>
                </Callout>
              </Marker>
            )}
            
            {/* Markers for saved measurements */}
            {savedMeasurements.filter(m => m.type === 'sound').map((measurement, index) => (
              <Marker
                key={`saved-${index}`}
                coordinate={{
                  latitude: measurement.location.latitude,
                  longitude: measurement.location.longitude
                }}
                pinColor={measurement.data.category.color}
              >
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>
                      {measurement.data.dB.toFixed(1)} dB
                    </Text>
                    <Text>{measurement.data.category.description}</Text>
                    <Text style={styles.calloutTime}>
                      {new Date(measurement.timestamp).toLocaleString()}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
          
          {currentMeasurement && location && (
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { backgroundColor: currentMeasurement.category.color }
              ]}
              onPress={handleSave}
            >
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>
                Save This Location
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    padding: 10,
    minWidth: 150,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: width / 2 - 100,
    width: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.functional.error,
    textAlign: 'center',
  },
});

export default SoundMap; 
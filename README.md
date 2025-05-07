# Sound Pollution Detector

A mobile application built with Expo and React Native that allows users to measure, visualize, and track sound pollution levels in their environment.

## Features

- **Real-time Sound Level Measurement**: Uses the device's microphone to measure ambient sound levels in decibels
- **Visual Sound Level Indicator**: Color-coded meter to show the current sound level and its potential harm to hearing
- **Sound Pollution Map**: Visualize sound pollution levels on a map with the ability to save measurements at specific locations
- **Historical Data**: Save and view historical sound measurements
- **Health Recommendations**: Get recommendations based on current sound levels

## Setup and Running

### Prerequisites

- Node.js (14.x or later)
- npm or yarn
- Expo CLI
- A physical device (for best results with microphone access)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sound-pollution-detector.git
cd sound-pollution-detector
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npx expo start
```

4. Scan the QR code with the Expo Go app on your device or run on an emulator.

### Permissions

This app requires the following permissions:
- Microphone access (to measure sound levels)
- Location access (to map sound data to locations)

## How Sound Pollution Is Measured

The app uses the device's microphone to capture audio and analyze its amplitude, which is then converted to an approximate decibel (dB) value. While this provides a reasonable approximation of sound levels, it's important to note that:

1. Mobile device microphones are not calibrated for precise sound level measurements
2. The accuracy can vary between different device models
3. The app should be used as an educational tool rather than for professional sound measurement

## Sound Level Categories

| Category | dB Range | Effects | Recommended Action |
|----------|----------|---------|-------------------|
| Normal | 0-70 dB | Safe for hearing | No action needed |
| Moderate | 71-85 dB | Extended exposure may cause damage | Limit exposure to less than 8 hours |
| High | 86-95 dB | Damage possible with extended exposure | Limit exposure to less than 1 hour. Consider ear protection |
| Very High | 96-110 dB | Hearing damage likely | Limit exposure to less than 15 minutes. Wear ear protection |
| Dangerous | 111+ dB | Immediate hearing damage risk | Avoid exposure or use strong ear protection immediately |

## Technologies Used

- React Native
- Expo
- Expo AV (audio recording)
- React Native Maps
- Expo Location
- AsyncStorage for data persistence

## How to Use the BioSignal Monitor

The BioSignal Monitor app is a comprehensive health monitoring tool that includes several features beyond sound pollution detection. Here's how to use each feature:

### Getting Started

1. **Initial Launch**: Upon first launch, you'll see a splash screen with the BioSignal Monitor branding.
2. **Onboarding Tutorial**: First-time users will be guided through an onboarding process that explains each monitoring feature. Swipe through the screens to learn about each function.
3. **Main Dashboard**: After completing onboarding, you'll be taken to the main dashboard where you can select different monitoring modes.

### Sound Pollution Detection

1. **Access Sound Meter**: Tap on the "Sound" tab in the bottom navigation.
2. **Start Measuring**: The app will automatically begin measuring ambient sound levels.
3. **Interpret Results**: 
   - View the real-time decibel (dB) value
   - Check the color-coded indicator (green for safe, yellow for moderate, orange for high, red for dangerous)
   - Read the recommendations based on the current sound level
4. **Save Measurement**: Tap the "Save" button to record the current sound level with location data.
5. **View Map**: Tap the "Map" icon to see saved sound measurements plotted on a map.

### Heart Rate Monitoring

1. **Access Heart Monitor**: Select the "Heart" option from the main dashboard.
2. **Position Camera**: Place your fingertip gently over the phone's camera lens.
3. **Stay Still**: Hold steady for 30-45 seconds while the app detects color changes in blood flow.
4. **View Results**: The app will display your heart rate in BPM (beats per minute) along with a confidence indicator.
5. **Save Reading**: Tap "Save" to store the measurement for future reference.

### Respiratory Rate Analysis

1. **Access Breathing Monitor**: Select the "Breathing" option from the dashboard.
2. **Position Device**: Hold the phone near your mouth or place it on a surface nearby.
3. **Breathe Normally**: Continue breathing normally for 30 seconds.
4. **View Results**: The app will calculate and display your breathing rate (breaths per minute).
5. **Save Reading**: Tap "Save" to record the measurement.

### Tremor Assessment

1. **Access Tremor Monitor**: Select the "Tremor" option from the dashboard.
2. **Hold Device**: Hold the phone in your hand with your arm extended.
3. **Remain Still**: Try to hold the position steady for 15 seconds.
4. **View Analysis**: The app will analyze movement patterns and display tremor frequency and intensity.
5. **Save Results**: Tap "Save" to record the assessment.

### Gait Analysis

1. **Access Gait Monitor**: Select the "Gait" option from the dashboard.
2. **Secure Device**: Place the phone in your pocket or attach it to your waist.
3. **Walk Normally**: Walk at your natural pace for about 20 steps.
4. **View Results**: The app will analyze your walking pattern and display metrics including steps per minute, symmetry, and stability.
5. **Save Analysis**: Tap "Save" to record the gait assessment.

### Speech Analysis

1. **Access Speech Monitor**: Select the "Speech" option from the dashboard.
2. **Record Speech**: Tap "Start" and read the provided text or speak naturally.
3. **Complete Recording**: Tap "Stop" when finished speaking.
4. **View Analysis**: The app will analyze speech patterns for clarity, volume, and rhythm.
5. **Save Results**: Tap "Save" to store the speech assessment.

### Managing Your Data

1. **Access History**: Tap the "History" tab to view all saved measurements.
2. **Filter Results**: Use the dropdown menu to filter by measurement type.
3. **View Trends**: Tap "Trends" to see graphs of your measurements over time.
4. **Export Data**: Tap the "Export" button to share your data via email or save it to your device.
5. **Delete Records**: Swipe left on any record and tap "Delete" to remove it.

### Adjusting Settings

1. **Access Settings**: Tap the gear icon in the top-right corner of the dashboard.
2. **Calibrate Sensors**: Use the calibration tools to improve measurement accuracy.
3. **Set Notification Preferences**: Choose when and how you want to be reminded to take measurements.
4. **Adjust Units**: Select your preferred measurement units (metric or imperial).
5. **Manage Privacy**: Control what data is stored and for how long.

## Measurement Accuracy Notes

While the BioSignal Monitor provides valuable health insights, please note that:

1. Mobile devices are not medical-grade equipment and measurements should be considered approximations.
2. Different devices may yield different results due to hardware variations.
3. For medical concerns, always consult healthcare professionals and use certified medical devices.
4. The app is designed for personal awareness and educational purposes rather than clinical diagnosis.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

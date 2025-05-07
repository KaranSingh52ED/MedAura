import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface MonitoringProgressProps {
  mode: 'sound' | 'cardiac' | 'respiratory' | 'tremor' | 'gait' | 'speech';
  data?: any[];
}

const MonitoringProgress: React.FC<MonitoringProgressProps> = ({ mode, data = [] }) => {
  // Generate some sample data if none provided
  const progressData = data.length > 0 ? data : generateSampleData(mode);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Overview</Text>
      
      <View style={styles.progressBar}>
        <View style={styles.barHeader}>
          <Text style={styles.barTitle}>{getMetricName(mode)}</Text>
          <Text style={styles.barValue}>{getCurrentValue(mode)}</Text>
        </View>
        <View style={styles.barContainer}>
          <View 
            style={[
              styles.barFill, 
              { 
                width: `${getProgressPercentage(mode)}%`,
                backgroundColor: getBarColor(mode)
              }
            ]} 
          />
        </View>
        <View style={styles.barLabels}>
          <Text style={styles.barMinLabel}>{getMinLabel(mode)}</Text>
          <Text style={styles.barMaxLabel}>{getMaxLabel(mode)}</Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="trending-up-outline" size={22} color={Colors.primary.main} />
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Trend</Text>
            <Text style={styles.statValue}>{getTrend(mode)}</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={22} color={Colors.primary.main} />
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{getDuration(mode)}</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="pulse-outline" size={22} color={Colors.primary.main} />
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Average</Text>
            <Text style={styles.statValue}>{getAverage(mode)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.visualChart}>
        {renderChart(mode, progressData)}
      </View>
    </View>
  );
};

// Helper functions for different monitoring modes

// Generate sample data
const generateSampleData = (mode: string) => {
  const baseData = Array.from({ length: 7 }, (_, i) => ({ 
    day: i, 
    value: Math.floor(Math.random() * 100) 
  }));
  
  switch (mode) {
    case 'sound':
      return baseData.map(item => ({ ...item, value: 40 + Math.floor(Math.random() * 40) }));
    case 'cardiac':
      return baseData.map(item => ({ ...item, value: 60 + Math.floor(Math.random() * 40) }));
    case 'respiratory':
      return baseData.map(item => ({ ...item, value: 12 + Math.floor(Math.random() * 8) }));
    case 'tremor':
      return baseData.map(item => ({ ...item, value: 1 + Math.floor(Math.random() * 4) }));
    case 'gait':
      return baseData.map(item => ({ ...item, value: 80 + Math.floor(Math.random() * 40) }));
    case 'speech':
      return baseData.map(item => ({ ...item, value: 70 + Math.floor(Math.random() * 30) }));
    default:
      return baseData;
  }
};

// Get the appropriate label for the metric being measured
const getMetricName = (mode: string): string => {
  switch (mode) {
    case 'sound': return 'Sound Level';
    case 'cardiac': return 'Heart Rate';
    case 'respiratory': return 'Respiratory Rate';
    case 'tremor': return 'Tremor Intensity';
    case 'gait': return 'Steps per Minute';
    case 'speech': return 'Speech Clarity';
    default: return 'Measurement';
  }
};

// Get the current value to display
const getCurrentValue = (mode: string): string => {
  switch (mode) {
    case 'sound': return '68 dB';
    case 'cardiac': return '72 BPM';
    case 'respiratory': return '16 breaths/min';
    case 'tremor': return 'Level 2';
    case 'gait': return '112 steps/min';
    case 'speech': return '85%';
    default: return 'N/A';
  }
};

// Get the progress percentage to fill the bar
const getProgressPercentage = (mode: string): number => {
  switch (mode) {
    case 'sound': return 68; // 68 out of 100 dB
    case 'cardiac': return 72; // 72% of max heart rate
    case 'respiratory': return 80; // 16 out of 20 breaths/min = 80%
    case 'tremor': return 40; // Level 2 out of 5 = 40%
    case 'gait': return 70; // 112 steps/min = 70% of max pace
    case 'speech': return 85; // 85% clarity
    default: return 50;
  }
};

// Get the appropriate color for the bar
const getBarColor = (mode: string): string => {
  return Colors.modes[mode as keyof typeof Colors.modes] || Colors.primary.main;
};

// Get the minimum label for the progress bar
const getMinLabel = (mode: string): string => {
  switch (mode) {
    case 'sound': return 'Quiet (30dB)';
    case 'cardiac': return 'Rest (60)';
    case 'respiratory': return 'Rest (12)';
    case 'tremor': return 'None';
    case 'gait': return 'Slow';
    case 'speech': return 'Unclear';
    default: return 'Min';
  }
};

// Get the maximum label for the progress bar
const getMaxLabel = (mode: string): string => {
  switch (mode) {
    case 'sound': return 'Loud (100dB)';
    case 'cardiac': return 'Active (160)';
    case 'respiratory': return 'Active (30)';
    case 'tremor': return 'Severe';
    case 'gait': return 'Fast';
    case 'speech': return 'Clear';
    default: return 'Max';
  }
};

// Get the trend text
const getTrend = (mode: string): string => {
  switch (mode) {
    case 'sound': return 'Decreasing (-5%)';
    case 'cardiac': return 'Stable';
    case 'respiratory': return 'Slight increase';
    case 'tremor': return 'Decreasing (-10%)';
    case 'gait': return 'Improving (+8%)';
    case 'speech': return 'Stable';
    default: return 'N/A';
  }
};

// Get the monitoring duration
const getDuration = (mode: string): string => {
  return '7 days';
};

// Get the average value
const getAverage = (mode: string): string => {
  switch (mode) {
    case 'sound': return '65 dB';
    case 'cardiac': return '74 BPM';
    case 'respiratory': return '15 breaths/min';
    case 'tremor': return 'Level 2.2';
    case 'gait': return '108 steps/min';
    case 'speech': return '82%';
    default: return 'N/A';
  }
};

// Render a chart based on the mode and data
const renderChart = (mode: string, data: any[]) => {
  // This is a simplified visualization - in a real app, you would use a charting library
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartBars}>
        {data.map((item, index) => (
          <View key={index} style={styles.chartBarContainer}>
            <View 
              style={[
                styles.chartBar, 
                { 
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: getBarColor(mode)
                }
              ]} 
            />
            <Text style={styles.chartLabel}>{getDayLabel(index)}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.chartTitle}>Weekly Trend</Text>
    </View>
  );
};

// Get the day label for the chart
const getDayLabel = (index: number): string => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days[index % 7];
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 16,
  },
  progressBar: {
    marginBottom: 20,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.neutral.dark,
  },
  barValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary.main,
  },
  barContainer: {
    height: 12,
    backgroundColor: Colors.neutral.lighter,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  barMinLabel: {
    fontSize: 12,
    color: Colors.neutral.medium,
  },
  barMaxLabel: {
    fontSize: 12,
    color: Colors.neutral.medium,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
  },
  statContent: {
    marginLeft: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral.medium,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.neutral.dark,
  },
  visualChart: {
    marginTop: 8,
  },
  chartContainer: {
    height: 160,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 8,
  },
  chartBarContainer: {
    alignItems: 'center',
    width: `${100 / 7}%`,
  },
  chartBar: {
    width: '60%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: Colors.neutral.medium,
    marginTop: 4,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default MonitoringProgress; 
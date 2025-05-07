import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface AdvancedAnalysisProps {
  mode: 'sound' | 'cardiac' | 'respiratory' | 'tremor' | 'gait' | 'speech';
  data?: any;
}

const AdvancedAnalysis: React.FC<AdvancedAnalysisProps> = ({ mode, data }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'risk'>('summary');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Analysis</Text>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
          onPress={() => setActiveTab('summary')}
        >
          <Ionicons 
            name="document-text-outline" 
            size={18} 
            color={activeTab === 'summary' ? Colors.primary.main : Colors.neutral.dark} 
          />
          <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>
            Summary
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'details' && styles.activeTab]}
          onPress={() => setActiveTab('details')}
        >
          <Ionicons 
            name="bar-chart-outline" 
            size={18} 
            color={activeTab === 'details' ? Colors.primary.main : Colors.neutral.dark} 
          />
          <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
            Details
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'risk' && styles.activeTab]}
          onPress={() => setActiveTab('risk')}
        >
          <Ionicons 
            name="warning-outline" 
            size={18} 
            color={activeTab === 'risk' ? Colors.primary.main : Colors.neutral.dark} 
          />
          <Text style={[styles.tabText, activeTab === 'risk' && styles.activeTabText]}>
            Risk Factors
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'summary' && (
          <ScrollView>
            <Text style={styles.sectionTitle}>Key Insights</Text>
            {getSummaryItems(mode).map((item, index) => (
              <View key={index} style={styles.insightItem}>
                <Ionicons name={item.icon as any} size={20} color={item.color} style={styles.insightIcon} />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{item.title}</Text>
                  <Text style={styles.insightDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
        
        {activeTab === 'details' && (
          <ScrollView>
            <Text style={styles.sectionTitle}>Detailed Metrics</Text>
            {getDetailMetrics(mode).map((metric, index) => (
              <View key={index} style={styles.metricContainer}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricName}>{metric.name}</Text>
                  <Text style={[styles.metricValue, { color: getValueColor(metric.status) }]}>
                    {metric.value}
                  </Text>
                </View>
                <View style={styles.metricBarContainer}>
                  <View 
                    style={[
                      styles.metricBar, 
                      { 
                        width: `${metric.percentage}%`,
                        backgroundColor: getValueColor(metric.status)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.metricDescription}>{metric.description}</Text>
              </View>
            ))}
          </ScrollView>
        )}
        
        {activeTab === 'risk' && (
          <ScrollView>
            <Text style={styles.sectionTitle}>Potential Risk Factors</Text>
            {getRiskFactors(mode).map((risk, index) => (
              <View key={index} style={styles.riskItem}>
                <View style={styles.riskHeader}>
                  <Ionicons 
                    name={getRiskIcon(risk.level)} 
                    size={22} 
                    color={getRiskColor(risk.level)} 
                  />
                  <Text style={styles.riskTitle}>{risk.title}</Text>
                  <View style={[styles.riskBadge, { backgroundColor: getRiskColor(risk.level) }]}>
                    <Text style={styles.riskLevel}>{risk.level}</Text>
                  </View>
                </View>
                <Text style={styles.riskDescription}>{risk.description}</Text>
                <View style={styles.riskActions}>
                  <TouchableOpacity style={styles.riskActionButton}>
                    <Text style={styles.riskActionText}>Learn More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

// Helper functions for generating content

// Get summary items based on monitoring mode
const getSummaryItems = (mode: string) => {
  switch (mode) {
    case 'sound':
      return [
        {
          icon: 'ear' as any,
          color: Colors.categories.safe,
          title: 'Good overall exposure',
          description: 'Your average sound exposure is within safe limits.'
        },
        {
          icon: 'trending-down',
          color: Colors.primary.main,
          title: 'Improved environment',
          description: 'Your sound environment has improved by 12% compared to last week.'
        },
        {
          icon: 'time',
          color: Colors.categories.moderate,
          title: 'Peak exposure time',
          description: 'Between 3-5pm, you experience the highest average noise levels.'
        }
      ];
    case 'cardiac':
      return [
        {
          icon: 'heart',
          color: Colors.categories.safe,
          title: 'Healthy heart rate',
          description: 'Your average resting heart rate is within the normal range.'
        },
        {
          icon: 'fitness',
          color: Colors.primary.main,
          title: 'Good recovery',
          description: 'Your heart shows good recovery after physical activity.'
        },
        {
          icon: 'bed',
          color: Colors.categories.moderate,
          title: 'Sleep pattern',
          description: 'Heart rate variability suggests some sleep quality issues.'
        }
      ];
    // Similar patterns for other monitoring modes...
    default:
      return [
        {
          icon: 'checkmark-circle',
          color: Colors.categories.safe,
          title: 'Normal readings',
          description: 'Your measurements are within normal ranges.'
        }
      ];
  }
};

// Get detailed metrics based on monitoring mode
const getDetailMetrics = (mode: string) => {
  switch (mode) {
    case 'sound':
      return [
        {
          name: 'Average Exposure',
          value: '65 dB',
          percentage: 65,
          status: 'normal',
          description: 'Your average sound exposure over the past week.'
        },
        {
          name: 'Peak Exposure',
          value: '88 dB',
          percentage: 88,
          status: 'warning',
          description: 'The highest sound level recorded in the past week.'
        },
        {
          name: 'Exposure Duration',
          value: '2.5 hours',
          percentage: 25,
          status: 'normal',
          description: 'Time spent above 80 dB in the past week.'
        },
        {
          name: 'Night Exposure',
          value: '42 dB',
          percentage: 42,
          status: 'good',
          description: 'Average sound level during nighttime hours.'
        }
      ];
    case 'cardiac':
      return [
        {
          name: 'Average Heart Rate',
          value: '72 BPM',
          percentage: 45,
          status: 'normal',
          description: 'Your average resting heart rate.'
        },
        {
          name: 'Heart Rate Variability',
          value: '45 ms',
          percentage: 45,
          status: 'normal',
          description: 'Variation in time between heartbeats.'
        },
        {
          name: 'Recovery Rate',
          value: '32 BPM',
          percentage: 64,
          status: 'good',
          description: 'Average decrease in heart rate 1 minute after exercise.'
        },
        {
          name: 'Resting Consistency',
          value: '±4 BPM',
          percentage: 80,
          status: 'good',
          description: 'Consistency of resting heart rate across days.'
        }
      ];
    // Similar patterns for other monitoring modes...
    default:
      return [
        {
          name: 'Primary Metric',
          value: 'Normal',
          percentage: 50,
          status: 'normal',
          description: 'Your main measurement status.'
        }
      ];
  }
};

// Get risk factors based on monitoring mode
const getRiskFactors = (mode: string) => {
  switch (mode) {
    case 'sound':
      return [
        {
          level: 'Low',
          title: 'Hearing Fatigue',
          description: 'Based on your exposure patterns, you have a low risk of hearing fatigue.'
        },
        {
          level: 'Medium',
          title: 'Stress Impact',
          description: 'Your sound environment may be contributing to moderate stress levels based on exposure durations.'
        },
        {
          level: 'Low',
          title: 'Sleep Disruption',
          description: 'Your nighttime sound levels are unlikely to cause significant sleep disruption.'
        }
      ];
    case 'cardiac':
      return [
        {
          level: 'Low',
          title: 'Cardiovascular Strain',
          description: 'Your heart rate patterns indicate low levels of cardiovascular strain.'
        },
        {
          level: 'Medium',
          title: 'Recovery Issues',
          description: 'Some heart rate recovery patterns suggest moderate risk of insufficient recovery.'
        },
        {
          level: 'Low',
          title: 'Rhythm Irregularities',
          description: 'Your measurements show a low probability of significant heart rhythm irregularities.'
        }
      ];
    // Similar patterns for other monitoring modes...
    default:
      return [
        {
          level: 'Low',
          title: 'General Health Risk',
          description: 'Your measurements indicate low general health risks.'
        }
      ];
  }
};

// Get color based on value status
const getValueColor = (status: string): string => {
  switch (status) {
    case 'good': return Colors.categories.safe;
    case 'normal': return Colors.primary.main;
    case 'warning': return Colors.categories.moderate;
    case 'critical': return Colors.categories.dangerous;
    default: return Colors.primary.main;
  }
};

// Get risk level icon
const getRiskIcon = (level: string): string => {
  switch (level) {
    case 'High': return 'alert-circle-outline';
    case 'Medium': return 'warning-outline';
    case 'Low': return 'information-circle-outline';
    default: return 'information-circle-outline';
  }
};

// Get risk level color
const getRiskColor = (level: string): string => {
  switch (level) {
    case 'High': return Colors.categories.dangerous;
    case 'Medium': return Colors.categories.moderate;
    case 'Low': return Colors.categories.safe;
    default: return Colors.primary.main;
  }
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lighter,
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary.main,
  },
  tabText: {
    fontSize: 14,
    color: Colors.neutral.dark,
    marginLeft: 4,
  },
  activeTabText: {
    color: Colors.primary.main,
    fontWeight: 'bold',
  },
  tabContent: {
    minHeight: 300,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 12,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: Colors.neutral.lightest,
    padding: 12,
    borderRadius: 8,
  },
  insightIcon: {
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 13,
    color: Colors.neutral.dark,
    lineHeight: 18,
  },
  metricContainer: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.neutral.dark,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricBarContainer: {
    height: 8,
    backgroundColor: Colors.neutral.lighter,
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  metricBar: {
    height: '100%',
    borderRadius: 4,
  },
  metricDescription: {
    fontSize: 12,
    color: Colors.neutral.dark,
    lineHeight: 16,
  },
  riskItem: {
    marginBottom: 16,
    backgroundColor: Colors.neutral.lightest,
    padding: 12,
    borderRadius: 8,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginLeft: 8,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  riskLevel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  riskDescription: {
    fontSize: 13,
    color: Colors.neutral.dark,
    lineHeight: 18,
    marginBottom: 12,
  },
  riskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  riskActionButton: {
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: Colors.neutral.lighter,
  },
  riskActionText: {
    fontSize: 12,
    color: Colors.primary.dark,
    fontWeight: 'bold',
  },
});

export default AdvancedAnalysis; 
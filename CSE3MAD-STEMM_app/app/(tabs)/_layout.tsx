import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';

export default function DashboardLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} bounces={false}>
        
        {/* 1. Black Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>STEMM Lab</Text>
          <Text style={styles.headerSubtitle}>Real-World Learning</Text>
        </View>

        {/* 2. White Body Section */}
        <View style={styles.bodyContainer}>
          
          {/* 3. The Overlapping Orange Card */}
          <View style={styles.orangeCard}>
            <Text style={styles.cardTitle}>Team Phoenix</Text>
            <Text style={styles.cardSubtitle}>Grade 5 • Team #247</Text>
            
            {/* Stats Row Placeholder */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}><Text style={styles.statText}>4/7</Text></View>
              <View style={styles.statBox}><Text style={styles.statText}>#12</Text></View>
              <View style={styles.statBox}><Text style={styles.statText}>2.4K</Text></View>
            </View>
          </View>

          {/* 4. Rest of the content goes here */}
          <View style={styles.factCard}>
            <Text style={styles.factTitle}>Science Fact of the Day</Text>
            <Text style={styles.factText}>A parachute works by creating air resistance...</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // Matches the top of the header so safe area doesn't look weird
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // The main white/gray background
  },
  headerContainer: {
    backgroundColor: '#000000',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 80, // Extra padding at the bottom to make room for the overlap
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 4,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  orangeCard: {
    backgroundColor: '#FF6600',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    // THE MAGIC TRICK: Pulls the card up over the header
    marginTop: -50, 
    // Shadows for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8, // For Android shadow
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statBox: {
    backgroundColor: 'rgba(0,0,0,0.15)', // Semi-transparent dark boxes
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  factCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  factTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  factText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  }
});
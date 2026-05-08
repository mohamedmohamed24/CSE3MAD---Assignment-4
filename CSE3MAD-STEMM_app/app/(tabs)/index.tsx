import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Data for the activities list
const ACTIVITIES = [
  {
    id: "1",
    title: "Parachute Drop Challenge",
    category: "Engineering",
    desc: "Design and test parachutes to reduce landing speed",
    icon: "rocket-outline",
    routeName: "ParachuteChallenge/parachute",
  },
  {
    id: "2",
    title: "Sound Pollution Hunter",
    category: "Environmental Science",
    desc: "Measure and compare sound levels in different activities",
    icon: "options-outline",
    routeName: "SoundPollutionHunter/sound",
  },
  {
    id: "3",
    title: "Hand Fan Challenge",
    category: "Physics",
    desc: "Test how air movement affects flexible materials",
    icon: "color-wand-outline",
    routeName: "HandFanChallenge/handfan",
  },
  {
    id: "4",
    title: "Earthquake-Resistant Structure",
    category: "Engineering",
    desc: "Design structures that withstand vibration",
    icon: "business-outline",
    routeName: "EarthquakeChallenge/earthquake",
  },
  {
    id: "5",
    title: "Human Performance Lab",
    category: "Medical Science",
    desc: "Measure speed, smoothness, and coordination",
    icon: "pulse-outline",
    routeName: "HumanPerformanceChallenge/humanperformance",
  },
  {
    id: "6",
    title: "Reaction Board Challenge",
    category: "Neuroscience",
    desc: "Measure reaction time and coordination",
    icon: "timer-outline",
    routeName: "ReactionChallenge/reaction",
  },
  {
    id: "7",
    title: "Breath Control Test",
    category: "Physiology",
    desc: "Measure lung capacity and breath control",
    icon: "water-outline",
    routeName: "BreathChallenge/breath",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const handlePress = (item: any) => {
    if (item.routeName) {
      router.push(item.routeName);
    } else {
      console.log("No route defined for this activity");
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Dark Top Header */}
      <View style={styles.headerBackground}>
        <Text style={styles.headerTitle}>STEMM Lab</Text>
        <Text style={styles.headerSubtitle}>Real-World Learning</Text>
      </View>

      {/* Main Content Area (Overlaps the dark header) */}
      <View style={styles.content}>
        {/* Orange Team Card */}
        <View style={styles.teamCard}>
          <Text style={styles.teamTitle}>Team Phoenix</Text>
          <Text style={styles.teamSubtitle}>Grade 6 • Team #247</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>4/7</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Rank</Text>
              <Text style={styles.statValue}>#12</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Points</Text>
              <Text style={styles.statValue}>2.4K</Text>
            </View>
          </View>
        </View>

        {/* Science Fact Card */}
        <View style={styles.factCard}>
          <View style={styles.factIconBox}>
            <Ionicons name="bulb" size={20} color="#FFF" />
          </View>
          <View style={styles.factTextContainer}>
            <Text style={styles.factTitle}>Science Fact of the Day</Text>
            <Text style={styles.factBody}>
              A parachute works by creating air resistance (drag force). The
              larger the parachute's surface area, the more air it catches,
              which slows down the fall.
            </Text>
          </View>
        </View>

        {/* Activities List */}
        <Text style={styles.sectionTitle}>Activities</Text>

        {ACTIVITIES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.activityCard}
            activeOpacity={0.7}
            onPress={() => handlePress(item)}
          >
            <View style={styles.activityIconBox}>
              <Ionicons name={item.icon as any} size={24} color="#FFF" />
            </View>

            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityCategory}>{item.category}</Text>
              <Text style={styles.activityDesc}>{item.desc}</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA", // Light grey background
  },
  headerBackground: {
    backgroundColor: "#000",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 80, // Extra padding for orange card overlap
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: -50, // Pulls the content up to overlap the black header
  },
  teamCard: {
    backgroundColor: "#FF5A00",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#FF5A00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  teamTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  teamSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    backgroundColor: "rgba(0,0,0,0.15)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    marginBottom: 4,
  },
  statValue: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  factCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  factIconBox: {
    backgroundColor: "#FF5A00",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  factTextContainer: {
    flex: 1,
  },
  factTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  factBody: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 25,
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  activityIconBox: {
    backgroundColor: "#FF5A00",
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  activityCategory: {
    fontSize: 11,
    color: "#FF5A00",
    marginTop: 2,
    marginBottom: 4,
  },
  activityDesc: {
    fontSize: 12,
    color: "#777",
  },
});

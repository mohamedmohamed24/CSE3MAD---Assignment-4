import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Data for the screen
const EQUIPMENT_LIST = [
  "Mobile phone with STEMM Lab app",
  "Raw egg",
  "Table or elevated surface",
  "Paper or plastic for parachute",
  "String",
  "Scissors",
  "Tape",
];

const INSTRUCTIONS = [
  "Drop the egg without a parachute and record the result (baseline test)",
  "Build a parachute using provided materials",
  "Start the timer, drop the egg, and record fall time",
  "Capture slow-motion video of the impact",
  "Check if the egg survived (intact, cracked, or broken)",
  "Test multiple designs and compare results",
  "Learn about drag force, terminal velocity, and impact physics",
];

export default function ParachuteChallenge() {
  const router = useRouter();

  // Track checkmarks for each equipment item independently
  const [checkedItems, setCheckedItems] = useState(
    new Array(EQUIPMENT_LIST.length).fill(false),
  );

  const toggleCheckbox = (index: number) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }} edges={["top"]}>
      {/* Dark Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parachute Drop Challenge</Text>
        <Text style={styles.headerSubtitle}>Engineering + Physics</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/* Orange Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardLabel}>Overview</Text>
          <Text style={styles.overviewText}>
            Students design, build, and test a parachute to protect an egg from
            breaking during a drop. Measure fall time, capture slow-motion
            impact, and analyze the physics of air resistance.
          </Text>
        </View>

        {/* Equipment Needed Section */}
        <View style={styles.whiteCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardEmoji}>📋</Text>
            <Text style={styles.sectionTitle}>Equipment Needed</Text>
          </View>

          {EQUIPMENT_LIST.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.equipmentRow}
              onPress={() => toggleCheckbox(index)}
              activeOpacity={0.6}
            >
              <Ionicons
                name={checkedItems[index] ? "checkbox" : "square-outline"}
                size={22}
                color={checkedItems[index] ? "#FF5A00" : "#CCC"}
              />
              <Text
                style={[
                  styles.equipmentText,
                  checkedItems[index] && styles.checkedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Instructions Section */}
        <View style={styles.whiteCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardEmoji}>📝</Text>
            <Text style={styles.sectionTitle}>Instructions</Text>
          </View>

          {INSTRUCTIONS.map((step, index) => (
            <View key={index} style={styles.instructionRow}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.push("/ParachuteChallenge/activitypage1")}
          style={styles.startButton}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start Activity</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  header: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
    backgroundColor: "#F7F8FA",
  },
  overviewCard: {
    backgroundColor: "#FF5A00",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardLabel: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  overviewText: {
    color: "#FFF",
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.9,
  },
  whiteCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cardEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  equipmentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  equipmentText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    flex: 1,
  },
  checkedText: {
    textDecorationLine: "line-through",
    color: "#AAA",
  },
  instructionRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  numberCircle: {
    backgroundColor: "#FF5A00",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  numberText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(247, 248, FA, 0.9)",
  },
  startButton: {
    backgroundColor: "#FF5A00",
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF5A00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

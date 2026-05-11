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

export default function ActivityDetail() {
  const router = useRouter();
  const [isEquipmentChecked, setIsEquipmentChecked] = useState(false);

  const INSTRUCTIONS = [
    "Measure noise from different actions (dropping objects, talking, walking, stamping feet)",
    "Record sound levels and locations",
    "Map loud and quiet zones",
    "Compare different sound sources",
    "Identify potential hearing hazards",
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }} edges={["top"]}>
      {/* Black Header Area */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sound Pollution Hunter</Text>
        <Text style={styles.headerSubtitle}>Environmental Science</Text>
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
            Students measure and compare sound levels in different classroom
            activities to understand sound intensity and hearing health.
          </Text>
        </View>

        {/* Equipment Needed Card with Interactive Tickbox */}
        <View style={styles.whiteCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardEmoji}>📋</Text>
            <Text style={styles.sectionTitle}>Equipment Needed</Text>
          </View>

          <TouchableOpacity
            style={styles.equipmentRow}
            onPress={() => setIsEquipmentChecked(!isEquipmentChecked)}
            activeOpacity={0.6}
          >
            <Ionicons
              name={isEquipmentChecked ? "checkbox" : "square-outline"}
              size={24}
              color={isEquipmentChecked ? "#FF5A00" : "#CCC"}
            />
            <Text
              style={[
                styles.equipmentText,
                isEquipmentChecked && styles.checkedText,
              ]}
            >
              Mobile phone with STEMM Lab app
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions Card */}
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

      {/* Start Button Fixed at Bottom */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={() => {
            router.push("./activity1");
          }}
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
    paddingBottom: 100,
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
    paddingVertical: 4,
  },
  equipmentText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
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
    backgroundColor: "transparent",
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

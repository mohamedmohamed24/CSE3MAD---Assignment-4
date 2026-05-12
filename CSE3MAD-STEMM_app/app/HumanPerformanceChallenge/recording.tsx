import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RecordingData {
  id: string;
  movementType: string;
  variation: string;
  smoothness: string;
}

export default function Recording() {
  const router = useRouter();
  const [movementType, setMovementType] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [movementVariation, setMovementVariation] = useState("±0cm");
  const [smoothness, setSmoothness] = useState("");
  const [recordings, setRecordings] = useState<RecordingData[]>([]);
  const [showResults, setShowResults] = useState(false);

  const getSmoothnessColor = (smoothnessLevel: string) => {
    switch (smoothnessLevel) {
      case "Very Smooth":
        return "#28A745"; // Green
      case "Smooth":
        return "#17A2B8"; // Cyan/Teal
      case "Moderate":
        return "#FF5A00"; // Orange
      case "Rough":
        return "#FD7E14"; // Dark Orange
      case "Very Rough":
        return "#DC3545"; // Red
      default:
        return "#666"; // Grey
    }
  };

  const handleStartRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      const newVariation = (Math.random() * 2 + 0.5).toFixed(2);
      const smoothnessLevels = ["Very Smooth", "Smooth", "Moderate", "Rough", "Very Rough"];
      const randomSmoothness = smoothnessLevels[Math.floor(Math.random() * smoothnessLevels.length)];
      setMovementVariation(`±${newVariation}cm`);
      setSmoothness(randomSmoothness);
      
      if (movementType.trim()) {
        const newRecording: RecordingData = {
          id: Date.now().toString(),
          movementType: movementType.trim(),
          variation: `±${newVariation}cm`,
          smoothness: randomSmoothness,
        };
        setRecordings([...recordings, newRecording]);
      }
    } else {
      // Start recording
      setIsRecording(true);
      setMovementVariation("±0.00cm");
      setSmoothness("Recording...");
    }
  };

  const handleSaveResult = () => {
    if (movementVariation !== "±0.00cm" && movementType.trim()) {
      setShowResults(true);
      router.push("/HumanPerformanceChallenge/results");
    }
  };

  const handleViewFullResults = () => {
    router.push("/HumanPerformanceChallenge/results");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Human Performance Lab</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Yellow Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            Select a movement, press Start Recording, perform the movement, then save the result. Record as many movements as you like before viewing results.
          </Text>
        </View>

        {/* Movement Type Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Movement Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Arm Circle - Fast"
            placeholderTextColor="#999"
            value={movementType}
            onChangeText={setMovementType}
          />
        </View>

        {/* Movement Variation Display */}
        <View style={styles.variationContainer}>
          <Text style={styles.variationLabel}>
            {recordings.length === 0 && movementVariation === "±0cm" && !isRecording
              ? "Movement Smoothness"
              : "Movement Variation"}
          </Text>
          <View style={styles.variationDisplay}>
            <Text style={styles.variationValue}>{movementVariation}</Text>
            <Text 
              style={[
                styles.smoothnessText,
                smoothness && { color: getSmoothnessColor(smoothness) }
              ]}
            >
              {smoothness || (recordings.length > 0 && movementVariation === "±0.00cm" ? "Awaiting recording" : "")}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={handleStartRecording}
            activeOpacity={0.8}
          >
            <Ionicons
              name="flash"
              size={24}
              color="#FFF"
            />
            <Text style={styles.recordButtonText}>
              {isRecording ? "Recording..." : "Start Recording"}
            </Text>
          </TouchableOpacity>

          {!isRecording && movementVariation !== "±0.00cm" && movementVariation !== "±0cm" && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveResult}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save Result</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recorded Results Section */}
        {recordings.length > 0 && (
          <View style={styles.recordedSection}>
            <View style={styles.recordedHeader}>
              <Text style={styles.recordedTitle}>
                Recorded So Far ({recordings.length})
              </Text>
              <TouchableOpacity onPress={handleViewFullResults}>
                <Text style={styles.viewResultsText}>View Full Results {'>'}</Text>
              </TouchableOpacity>
            </View>

            {recordings.map((recording) => (
              <View key={recording.id} style={styles.recordingItem}>
                <View style={styles.recordingInfo}>
                  <Text style={styles.recordingMovement}>{recording.movementType}</Text>
                  <Text style={styles.recordingVariation}>
                    {recording.variation} {recording.smoothness}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoBox: {
    backgroundColor: "#FFF3CD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  infoBoxText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  variationContainer: {
    marginBottom: 24,
  },
  variationLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  variationDisplay: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  variationValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF5A00",
  },
  smoothnessText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  buttonContainer: {
    marginBottom: 24,
    gap: 12,
  },
  recordButton: {
    backgroundColor: "#FF5A00",
    borderRadius: 12,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  recordingButton: {
    backgroundColor: "#DC3545",
  },
  recordButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  recordedSection: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  recordedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  recordedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  viewResultsText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  recordingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  recordingInfo: {
    flex: 1,
  },
  recordingMovement: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  recordingVariation: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

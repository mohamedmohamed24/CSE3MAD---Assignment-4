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

export default function Results() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  
  // Sample data - in a real app, this would come from state management or async storage
  const recordings: RecordingData[] = [
    {
      id: "1",
      movementType: "Arm Circle - Fast",
      variation: "±1.09cm",
      smoothness: "Moderate",
    },
  ];

  const avgVariation = "1.09";
  const smoothest = "1.09cm";

  const handleStarPress = (starIndex: number) => {
    setRating(starIndex);
  };

  const handleSubmit = () => {
    console.log("Submitted with rating:", rating, "comment:", comment);
    router.back();
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
        <Text style={styles.headerTitle}>Results</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>RECORDINGS</Text>
            <Text style={styles.summaryValue}>{recordings.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>AVG VARIATION</Text>
            <Text style={styles.summaryValue}>{avgVariation} cm</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>SMOOTHEST</Text>
            <Text style={styles.summaryValue}>{smoothest}</Text>
          </View>
        </View>

        {/* Recorded Movement Data */}
        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitle}>RECORDED MOVEMENT DATA</Text>
          {recordings.map((recording) => (
            <View key={recording.id} style={styles.recordingItem}>
              <Text style={styles.recordingMovement}>{recording.movementType}</Text>
              <Text style={styles.recordingDetails}>
                {recording.variation} {recording.smoothness}
              </Text>
            </View>
          ))}
        </View>

        {/* Best Performance */}
        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitle}>BEST PERFORMANCE</Text>
          <View style={styles.bestPerformance}>
            <Ionicons name="trophy" size={40} color="#FFD700" />
            <View style={styles.bestPerformanceText}>
              <Text style={styles.bestTitle}>Arm Circle - Fast</Text>
              <Text style={styles.bestDetails}>±1.09cm Moderate</Text>
            </View>
          </View>
        </View>

        {/* Understanding Human Movement */}
        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitle}>Understanding Human Movement</Text>
          <Text style={styles.description}>
            Movement smoothness is a key indicator of motor control quality. 
            Lower variation values indicate more consistent and controlled movements.
          </Text>
          <View style={styles.keyFacts}>
            <Text style={styles.keyFactsTitle}>KEY FACTS</Text>
            <View style={styles.factItem}>
              <Ionicons name="checkmark-circle" size={20} color="#28A745" />
              <Text style={styles.factText}>Smooth movements reduce injury risk</Text>
            </View>
            <View style={styles.factItem}>
              <Ionicons name="checkmark-circle" size={20} color="#28A745" />
              <Text style={styles.factText}>Consistency improves with practice</Text>
            </View>
            <View style={styles.factItem}>
              <Ionicons name="checkmark-circle" size={20} color="#28A745" />
              <Text style={styles.factText}>Range of motion affects performance</Text>
            </View>
          </View>
        </View>

        {/* Rate This Activity */}
        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitle}>Rate This Activity</Text>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={32}
                  color={star <= rating ? "#FFD700" : "#CCC"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comments */}
        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitle}>Comments</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Share your thoughts..."
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit & Complete Activity</Text>
        </TouchableOpacity>
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
  summaryCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF5A00",
  },
  whiteCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  recordingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  recordingMovement: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  recordingDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  bestPerformance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  bestPerformanceText: {
    flex: 1,
  },
  bestTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bestDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },
  keyFacts: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
  },
  keyFactsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  factItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  factText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  commentInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#FF5A00",
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

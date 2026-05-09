import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ParachuteMeasurement() {
  const router = useRouter();

  // State for user inputs
  const [dropHeight, setDropHeight] = useState("");
  const [fallTime, setFallTime] = useState("");
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const recordVideo = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await MediaLibrary.requestPermissionsAsync();

    if (
      cameraPermission.status !== "granted" ||
      libraryPermission.status !== "granted"
    ) {
      Alert.alert(
        "Permission Needed",
        "We need camera and gallery access to save your experiment!",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "videos" as any,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      setVideoUri(localUri);
      try {
        // 4. Save to Gallery
        await MediaLibrary.saveToLibraryAsync(localUri);
        Alert.alert("Success", "Video saved to your gallery!");
      } catch (error) {
        console.error("Save Error:", error);
        Alert.alert("Error", "Could not save video to gallery.");
      }
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black" }}
      edges={["top", "bottom"]}
    >
      {/* Black Header Area */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>No Adjustment</Text>
            <Text style={styles.headerSubtitle}>
              Baseline drop — no parachute
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/* Instruction Alert Box */}
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            🌳 Drop the toy{" "}
            <Text style={{ fontWeight: "bold", color: "#B30000" }}>
              without
            </Text>{" "}
            any parachute. Record the height you dropped it from and how long it
            took to land.
          </Text>
        </View>

        {/* Measurement Input Card */}
        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitle}>Enter Your Measurements</Text>

          {/* Drop Height Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Drop Height <Text style={styles.unitText}>(metres)</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={dropHeight}
              onChangeText={setDropHeight}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#CCC"
              returnKeyType="done"
            />
          </View>

          {/* Fall Time Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Fall Time <Text style={styles.unitText}>(seconds)</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={fallTime}
              onChangeText={setFallTime}
              keyboardType="decimal-pad"
              placeholder="0.0"
              placeholderTextColor="#CCC"
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Record Video Button */}
        <TouchableOpacity
          style={styles.recordButton}
          onPress={recordVideo}
          activeOpacity={0.7}
        >
          <Ionicons name="videocam" size={24} color="#FF5A00" />
          <Text style={styles.recordButtonText}>Record Impact Video</Text>
          {videoUri && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="green"
              style={{ marginLeft: 10 }}
            />
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Next Button Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} activeOpacity={0.8}>
          <Text style={styles.nextButtonText}>Next: Add Parachute</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
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
    paddingTop: 2.35,
  },
  backButton: {
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    backgroundColor: "#FF2A2A",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  stepNumber: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 22,
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
  alertBox: {
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FFD6D6",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  alertText: {
    color: "#B30000",
    fontSize: 14,
    lineHeight: 20,
  },
  whiteCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  unitText: {
    color: "#999",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    padding: 15,
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    backgroundColor: "#FFF",
  },
  recordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#FF5A00",
    borderRadius: 12,
    padding: 15,
    borderStyle: "dashed",
  },
  recordButtonText: {
    color: "#FF5A00",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#FFF",
  },
  nextButton: {
    backgroundColor: "#FF5A00",
    borderRadius: 12,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF5A00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
});

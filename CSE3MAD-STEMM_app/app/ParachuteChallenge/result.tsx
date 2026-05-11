import { db, storage } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ParachuteResults() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [rating, setRating] = useState(0);

  const [videoNoUri, setVideoNoUri] = useState<string | null>(null);
  const [videoWithUri, setVideoWithUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState("");

  // 1. Retrieve and Parse Data from Params
  const heightNo = parseFloat(params.heightNo as string) || 0;
  const timeNo = parseFloat(params.timeNo as string) || 0;
  const heightWith = parseFloat(params.heightWith as string) || 0;
  const timeWith = parseFloat(params.timeWith as string) || 0;

  // 2. Logic Calculations (MOVED UP so handleSubmit can see them)
  const speedNo = timeNo > 0 ? (heightNo / timeNo).toFixed(2) : "0.00";
  const speedWith = timeWith > 0 ? (heightWith / timeWith).toFixed(2) : "0.00";
  const timeDiffPercent =
    timeNo > 0 ? (((timeWith - timeNo) / timeNo) * 100).toFixed(1) : "0.0";
  const isSuccess = parseFloat(timeDiffPercent) > 0;

  const pickVideo = async (type: "no" | "with") => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "videos" as any,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "no") setVideoNoUri(result.assets[0].uri);
      if (type === "with") setVideoWithUri(result.assets[0].uri);
    }
  };

  const uploadVideoToFirebase = async (
    uri: string | null,
    filename: string,
  ) => {
    if (!uri) return null;

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `activity1_videos/${filename}`);

      // FIX: Removed "const uploadTask =" since we don't need the variable
      await uploadBytesResumable(storageRef, blob);

      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error("Video upload failed:", error);
      throw error;
    }
  };

  // --- SUBMIT LOGIC ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const timestamp = Date.now();
      const noVideoUrl = await uploadVideoToFirebase(
        videoNoUri,
        `no_parachute_${timestamp}.mp4`,
      );
      const withVideoUrl = await uploadVideoToFirebase(
        videoWithUri,
        `with_parachute_${timestamp}.mp4`,
      );

      const activityData = {
        heightNo,
        timeNo,
        speedNo: parseFloat(speedNo),
        heightWith,
        timeWith,
        speedWith: parseFloat(speedWith),
        timeDiffPercent: parseFloat(timeDiffPercent),
        rating,
        comments,
        noVideoUrl,
        withVideoUrl,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "activity1"), activityData);

      console.log("Activity saved with ID: ", docRef.id);
      alert("Results and videos submitted successfully! 🚀");

      // router.replace("/home");
    } catch (e) {
      console.error("Submission error: ", e);
      alert("Failed to save results. Check your connection and console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Black Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results</Text>
        <Text style={styles.headerSubtitle}>
          How did your parachute perform?
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/* DROP COMPARISON SECTION */}
        <View style={styles.comparisonCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>DROP COMPARISON</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.subCard, styles.redBorder]}>
              <Text style={[styles.label, { color: "#FF5252" }]}>
                NO PARACHUTE
              </Text>
              <DataRow label="Height" value={`${heightNo} m`} />
              <DataRow label="Time" value={`${timeNo} s`} />
              <DataRow label="Speed" value={`${speedNo} m/s`} />
            </View>

            <View style={[styles.subCard, styles.greenBorder]}>
              <Text style={[styles.label, { color: "#4CAF50" }]}>
                WITH PARACHUTE
              </Text>
              <DataRow label="Height" value={`${heightWith} m`} />
              <DataRow label="Time" value={`${timeWith} s`} />
              <DataRow label="Speed" value={`${speedWith} m/s`} />
            </View>
          </View>

          <View
            style={[
              styles.diffCard,
              isSuccess ? styles.successBg : styles.failBg,
            ]}
          >
            <Text style={styles.diffLabel}>TIME DIFFERENCE</Text>
            <Text
              style={[
                styles.diffValue,
                { color: isSuccess ? "#2E7D32" : "#A34E14" },
              ]}
            >
              {isSuccess ? "+" : ""}
              {timeDiffPercent}%
            </Text>
            <View style={styles.statusRow}>
              <Ionicons
                name={isSuccess ? "checkmark-circle" : "warning"}
                size={16}
                color={isSuccess ? "#2E7D32" : "#A34E14"}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isSuccess ? "#2E7D32" : "#A34E14" },
                ]}
              >
                {isSuccess
                  ? "Great job! The parachute slowed the fall."
                  : "Parachute didn't slow the fall — try again!"}
              </Text>
            </View>
          </View>
        </View>

        {/* SCIENCE CONTENT SECTION */}
        <View style={styles.scienceCard}>
          <View style={styles.scienceHeader}>
            <Ionicons name="bulb-outline" size={20} color="#3F51B5" />
            <Text style={styles.scienceTitle}>Science Behind Parachutes</Text>
          </View>
          <Text style={styles.scienceBody}>
            Parachutes work by increasing{" "}
            <Text style={{ fontWeight: "bold" }}>air resistance (drag)</Text>.
            When a large surface area pushes against air molecules, it creates
            an upward force that slows descent.
          </Text>
          <View style={styles.keyFactsBox}>
            <Text style={styles.keyFactTitle}>KEY FACTS</Text>
            <Text style={styles.factText}>
              • Drag force increases with surface area
            </Text>
            <Text style={styles.factText}>
              • Larger canopy = more air resistance = slower fall
            </Text>
            <Text style={styles.factText}>
              • Even string distribution keeps the parachute stable
            </Text>
          </View>
        </View>

        {/* FEEDBACK & RATING SECTION */}
        <View style={styles.rateCard}>
          <Text style={styles.sectionTitle}>Rate This Activity</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Ionicons
                  name={s <= rating ? "star" : "star-outline"}
                  size={36}
                  color={s <= rating ? "#FFD700" : "#DDD"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.inputLabel}>
            Comments <Text style={{ color: "#999" }}>(Optional)</Text>
          </Text>
          <TextInput
            style={styles.commentInput}
            placeholder="What did you learn?"
            multiline
            value={comments}
            onChangeText={setComments}
          />

          {/* VIDEO UPLOAD SECTION */}
          <Text style={styles.inputLabel}>
            Upload Videos <Text style={{ color: "#999" }}>(Optional)</Text>
          </Text>
          <View style={styles.row}>
            <UploadPlaceholder
              label="No Parachute"
              color="#FFF0F0"
              iconColor="#FF5252"
              hasVideo={!!videoNoUri}
              onPress={() => pickVideo("no")}
            />
            <UploadPlaceholder
              label="With Parachute"
              color="#F0FFF4"
              iconColor="#4CAF50"
              hasVideo={!!videoWithUri}
              onPress={() => pickVideo("with")}
            />
          </View>
        </View>

        {/* FINAL SUBMIT BUTTON */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons
                name="checkmark-done"
                size={20}
                color="#FFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.submitButtonText}>
                Submit & Complete Activity
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper component for data rows
const DataRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value}</Text>
  </View>
);

// FIX: Added onPress and hasVideo to the component props so the buttons actually work
const UploadPlaceholder = ({
  label,
  color,
  iconColor,
  hasVideo,
  onPress,
}: any) => (
  <TouchableOpacity
    style={[styles.uploadBox, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Ionicons
      name={hasVideo ? "checkmark-circle" : "videocam-outline"}
      size={24}
      color={iconColor}
    />
    <Text style={[styles.uploadText, { color: iconColor }]}>{label}</Text>
    <Text style={[styles.uploadSubtext, { color: iconColor }]}>
      {hasVideo ? "Video Selected!" : "Tap to upload"}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  header: { backgroundColor: "#000", padding: 20, paddingBottom: 30 },
  backButton: { marginBottom: 15 },
  headerTitle: { color: "#FFF", fontSize: 26, fontWeight: "bold" },
  headerSubtitle: { color: "#999", fontSize: 14, marginTop: 4 },
  scrollContent: { padding: 16, paddingBottom: 50, backgroundColor: "#F7F8FA" },

  // Comparison Card Styles
  comparisonCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 2,
  },
  cardHeader: { backgroundColor: "#2D2D2D", padding: 12 },
  cardHeaderText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
  },
  row: { flexDirection: "row", padding: 12, gap: 12 },
  subCard: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1 },
  redBorder: { borderColor: "#FFDADA", backgroundColor: "#FFFBFB" },
  greenBorder: { borderColor: "#DFFFD6", backgroundColor: "#FBFFFB" },
  label: { fontSize: 10, fontWeight: "bold", marginBottom: 10 },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dataLabel: { fontSize: 12, color: "#777" },
  dataValue: { fontSize: 12, fontWeight: "bold", color: "#000" },

  // Performance Box Styles
  diffCard: {
    margin: 12,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  successBg: { backgroundColor: "#E8F5E9", borderColor: "#C8E6C9" },
  failBg: { backgroundColor: "#FFF8E1", borderColor: "#FFECB3" },
  diffLabel: { fontSize: 10, color: "#888", fontWeight: "bold" },
  diffValue: { fontSize: 36, fontWeight: "bold", marginVertical: 8 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusText: { fontSize: 13, fontWeight: "500" },

  // Science Section
  scienceCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  scienceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  scienceTitle: { fontSize: 18, fontWeight: "bold", color: "#3F51B5" },
  scienceBody: { fontSize: 14, color: "#444", lineHeight: 22 },
  keyFactsBox: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
  },
  keyFactTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#3F51B5",
    marginBottom: 10,
  },
  factText: { fontSize: 13, color: "#555", marginBottom: 6 },

  // Rating Section
  rateCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
    color: "#333",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    height: 100,
    textAlignVertical: "top",
    backgroundColor: "#FAFAFA",
  },

  uploadBox: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
  },
  uploadText: { fontSize: 13, fontWeight: "bold", marginTop: 8 },
  uploadSubtext: { fontSize: 11, marginTop: 2 },

  // Submit Button
  submitButton: {
    backgroundColor: "#FFB397",
    borderRadius: 16,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});

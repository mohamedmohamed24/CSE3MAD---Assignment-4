import { db, storage } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { createAudioPlayer } from "expo-audio";
import * as Location from "expo-location";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResultScreen({ navigation }: any) {
  const route = useRoute<any>();
  const { results } = route.params || { results: [] };
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const playSound = (uri: string) => {
    try {
      const player = createAudioPlayer(uri);
      player.play();
    } catch (e) {
      console.error("Playback failed", e);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);

    try {
      // 1. Upload all audio files to Firebase Storage
      const uploadedResults = await Promise.all(
        results.map(async (item: any) => {
          if (!item.audioUri) return item;

          const response = await fetch(item.audioUri);
          const blob = await response.blob();
          const storageRef = ref(
            storage,
            `sounds/${Date.now()}-${item.id}.m4a`,
          );

          await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageRef);

          return { ...item, audioUri: downloadUrl };
        }),
      );

      // 2. Save metadata to Firestore
      await addDoc(collection(db, "soundChallenges"), {
        results: uploadedResults,
        rating,
        comments,
        location: location
          ? {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            }
          : null,
        timestamp: new Date(),
      });

      Alert.alert("Success", "Results submitted to the team!");
      router.replace("/");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit results.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={40} color="white" />
          </View>
          <Text style={styles.title}>Activity Complete!</Text>
          <Text style={styles.subtitle}>Share your results with the team</Text>
        </View>

        {/* Recorded Clips Section (List of sounds from previous page) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cloud-upload-outline" size={20} color="#FF6B00" />
            <Text style={styles.cardTitle}>Recorded Clips</Text>
          </View>

          {results.map((item: any) => (
            <View key={item.id} style={styles.recordingItem}>
              <View>
                <Text style={styles.recordingAction}>{item.action}</Text>
                <Text style={styles.recordingDb}>{item.db} dB</Text>
              </View>
              <TouchableOpacity onPress={() => playSound(item.audioUri)}>
                <Ionicons name="play-circle" size={32} color="#FF6B00" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Rating Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="star-outline" size={20} color="#FF6B00" />
            <Text style={styles.cardTitle}>Rate this Activity</Text>
          </View>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Ionicons
                  name={rating >= s ? "star" : "star-outline"}
                  size={40}
                  color={rating >= s ? "#FFBB00" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="chatbubble-outline" size={20} color="#FF6B00" />
            <Text style={styles.cardTitle}>Outcome Comments</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="What did you learn? What worked well?"
            multiline
            value={comments}
            onChangeText={setComments}
          />
        </View>

        {/* Location Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-outline" size={20} color="#FF6B00" />
            <Text style={styles.cardTitle}>Location</Text>
          </View>
          <View style={styles.locationBox}>
            <Ionicons name="location" size={20} color="#FF6B00" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.locationText}>GPS Coordinates</Text>
              <Text style={styles.coords}>
                {location
                  ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
                  : "Fetching location..."}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, rating === 0 && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitText}>Submit Results</Text>
          )}
        </TouchableOpacity>

        {rating === 0 && (
          <Text style={styles.footerHint}>
            Please rate the activity to continue
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { padding: 20 },
  headerSection: { alignItems: "center", marginBottom: 30 },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  subtitle: { color: "#6B7280", fontSize: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  recordingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  recordingAction: { fontSize: 14, fontWeight: "500" },
  recordingDb: { fontSize: 12, color: "#FF6B00" },
  starRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  textInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
  },
  locationText: { fontSize: 14, fontWeight: "600" },
  coords: { fontSize: 12, color: "#6B7280" },
  submitButton: {
    backgroundColor: "#FF6B00",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: { backgroundColor: "#FFD1BA" },
  submitText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  footerHint: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 12,
    fontSize: 12,
  },
});

import { Ionicons } from "@expo/vector-icons";
import {
  AudioModule,
  AudioPlayer,
  createAudioPlayer,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SoundResult {
  id: string;
  action: string;
  db: number;
  audioUri: string | null;
}

export default function SoundPollutionHunter() {
  const [actionText, setActionText] = useState("");
  const [decibels, setDecibels] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [results, setResults] = useState<SoundResult[]>([]);

  // Track the highest dB and the currently playing audio to prevent memory leaks
  const maxDbRef = useRef(0);
  const currentPlayerRef = useRef<AudioPlayer | null>(null);

  // Initialize the new expo-audio recorder hook with metering enabled
  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recordingState = useAudioRecorderState(audioRecorder, 200);

  // Clean up any active audio player if the component unmounts
  useEffect(() => {
    return () => {
      if (currentPlayerRef.current) {
        currentPlayerRef.current.release();
      }
    };
  }, []);

  // Sync metering state with your decibel logic
  useEffect(() => {
    if (isRecording && recordingState.metering !== undefined) {
      // Mapping Expo's metering to a displayable dB scale
      const currentDb = Math.max(0, Math.round(recordingState.metering + 100));
      setDecibels(currentDb);
      if (currentDb > maxDbRef.current) {
        maxDbRef.current = currentDb;
      }
    }
  }, [recordingState.metering, isRecording]);

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) return;

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      maxDbRef.current = 0;
      setDecibels(0);
      setCurrentUri(null);

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setDecibels(maxDbRef.current);

      await audioRecorder.stop();
      setCurrentUri(audioRecorder.uri || null);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const handleSaveResult = () => {
    if (!actionText.trim() || !currentUri) return;

    const newResult: SoundResult = {
      id: Date.now().toString(),
      action: actionText,
      db: decibels,
      audioUri: currentUri,
    };

    setResults([...results, newResult]);

    // Reset UI for the next measure
    setActionText("");
    setDecibels(0);
    setCurrentUri(null);
    maxDbRef.current = 0;
  };

  const handleDeleteResult = (id: string) => {
    setResults(results.filter((item) => item.id !== id));
  };

  const playRecording = async (uri: string | null) => {
    if (!uri) return;

    try {
      // 1. Force the audio mode to playback.
      // Sometimes staying in "recording" mode routes audio to the earpiece (very quiet) instead of the speaker.
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      if (currentPlayerRef.current) {
        await currentPlayerRef.current.release();
      }

      // 2. The constructor mismatch fix:
      // Instead of the helper 'createAudioPlayer(uri)', we use the base source object.
      const player = createAudioPlayer({ uri });

      if (player) {
        currentPlayerRef.current = player;
        player.play();
      }
    } catch (error) {
      console.error("Playback failed:", error);
      // If it still fails, the URI might need a prefix check
      if (!uri.startsWith("file://")) {
        console.log("URI might be missing file:// prefix");
      }
    }
  };

  const handleCompleteActivity = () => {
    console.log("Activity completed with results:", results);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Sound Pollution Hunter</Text>
          <Text style={styles.headerSubtitle}>Environmental Science</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.label}>Action</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Dropping a pen"
            value={actionText}
            onChangeText={setActionText}
            editable={!isRecording}
          />

          <View style={styles.dbContainer}>
            <Text style={styles.dbNumber}>{decibels}</Text>
            <Text style={styles.dbText}>Decibels (dB)</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isRecording && styles.recordingButton,
            ]}
            onPress={toggleRecording}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={20}
              color="white"
              style={styles.btnIcon}
            />
            <Text style={styles.buttonText}>
              {isRecording ? "Stop Measuring" : "Measure Sound"}
            </Text>
          </TouchableOpacity>

          {!isRecording && currentUri && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSaveResult}
            >
              <Ionicons
                name="save-outline"
                size={20}
                color="white"
                style={styles.btnIcon}
              />
              <Text style={styles.buttonText}>Save Result</Text>
            </TouchableOpacity>
          )}
        </View>

        {results.length > 0 && (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Results</Text>
            {results.map((item) => (
              <View key={item.id} style={styles.resultRow}>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultAction}>{item.action}</Text>
                  <Text style={styles.resultDbSmall}>{item.db} dB</Text>
                </View>

                <View style={styles.resultRightSide}>
                  <TouchableOpacity
                    onPress={() => playRecording(item.audioUri)}
                    style={styles.playIcon}
                  >
                    <Ionicons name="play-circle" size={26} color="#FF6B00" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteResult(item.id)}
                    style={styles.deleteIcon}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Understanding Sound Pollution</Text>
          <Text style={styles.infoText}>
            Sound is measured in decibels (dB). Prolonged exposure to sounds
            above 85 dB can damage hearing.
          </Text>
          <View style={styles.referenceBox}>
            <Text style={styles.referenceTitle}>Sound Level Reference:</Text>
            <Text style={styles.referenceText}>
              30-40 dB = Whisper or quiet library
            </Text>
            <Text style={styles.referenceText}>
              50-60 dB = Normal conversation
            </Text>
            <Text style={styles.referenceText}>
              70-80 dB = Traffic or vacuum cleaner
            </Text>
            <Text style={styles.referenceText}>
              85+ dB = Hearing damage zone
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteActivity}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color="white"
            style={styles.btnIcon}
          />
          <Text style={styles.buttonText}>Complete Activity</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#000",
  },
  backButton: { marginRight: 16 },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  headerSubtitle: { color: "#AAA", fontSize: 14 },
  scrollContent: { padding: 16, backgroundColor: "#F9FAFB", minHeight: "100%" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  label: { fontSize: 14, color: "#4B5563", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  dbContainer: { alignItems: "center", marginBottom: 24 },
  dbNumber: { fontSize: 64, fontWeight: "bold", color: "#FF6B00" },
  dbText: { fontSize: 16, color: "#6B7280" },
  primaryButton: {
    backgroundColor: "#FF6B00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  recordingButton: { backgroundColor: "#FF3B30" },
  secondaryButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
  },
  btnIcon: { marginRight: 8 },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  resultsCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resultsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  resultTextContainer: { flex: 1 },
  resultAction: { fontSize: 16, fontWeight: "500" },
  resultDbSmall: { fontSize: 14, color: "#FF6B00", fontWeight: "bold" },
  resultRightSide: { flexDirection: "row", alignItems: "center" },
  playIcon: { paddingHorizontal: 10 },
  deleteIcon: { padding: 4 },
  infoBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 20,
    marginBottom: 16,
  },
  referenceBox: { backgroundColor: "#FFF", padding: 16, borderRadius: 12 },
  referenceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  referenceText: { fontSize: 12, color: "#1E40AF", marginBottom: 4 },
  completeButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
});

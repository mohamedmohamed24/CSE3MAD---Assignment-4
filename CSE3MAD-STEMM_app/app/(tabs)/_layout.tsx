import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          // Styling the bottom tab bar
          tabBarStyle: {
            backgroundColor: "#000000",
            borderTopWidth: 0,
            paddingBottom: 5,
            height: 60,
          },
          tabBarActiveTintColor: "#FF5A00",
          tabBarInactiveTintColor: "#666666",
          headerShown: false,
        }}
      >
        {/* Dashboard Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <Ionicons name="grid-outline" size={24} color={color} />
            ),
          }}
        />

        {/* Leaderboard Tab */}
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: "Leaderboard",
            tabBarIcon: ({ color }) => (
              <Ionicons name="trophy-outline" size={24} color={color} />
            ),
          }}
        />

        {/* Video Hub Tab */}
        <Tabs.Screen
          name="video"
          options={{
            title: "Video Hub",
            tabBarIcon: ({ color }) => (
              <Ionicons name="videocam-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

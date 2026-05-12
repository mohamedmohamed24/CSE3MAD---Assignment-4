# STEMM Lab App

This is a [Expo](https://expo.dev) project for the STEMM (Science, Technology, Engineering, Mathematics, Medical) Lab application. The app includes various interactive challenges and activities for students to explore different STEM concepts.

## Features

- **Human Performance Lab**: Measure movement smoothness, speed, and coordination during controlled activities
- **Breath Challenge**: Breathing exercises and monitoring
- **Earthquake Challenge**: Simulate and learn about earthquake detection
- **Hand Fan Challenge**: Interactive hand fan activities
- **Parachute Challenge**: Physics-based parachute experiments
- **Reaction Challenge**: Test and improve reaction times
- **Sound Pollution Hunter**: Environmental sound monitoring

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

### Running on Different Platforms

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

## Project Structure

The app uses [file-based routing](https://docs.expo.dev/router/introduction). Navigate to different challenges through the app directory:

- `app/HumanPerformanceChallenge/` - Human Performance Lab activities
- `app/BreathChallenge/` - Breathing exercises
- `app/EarthquakeChallenge/` - Earthquake simulation
- `app/HandFanChallenge/` - Hand fan activities
- `app/ParachuteChallenge/` - Parachute experiments
- `app/ReactionChallenge/` - Reaction time tests
- `app/SoundPollutionHunter/` - Sound monitoring

## Human Performance Lab

The Human Performance Lab feature allows students to:
- Enter movement types (e.g., "Arm Circle - Fast")
- Record movements using the phone's sensors
- View movement variation measurements (± values)
- Track smoothness ratings (Very Smooth, Smooth, Moderate, Rough, Very Rough)
- Save and review recorded results
- View performance statistics and summaries

### Navigation Flow

1. **Overview Screen** (`humanperformance.tsx`) - Shows equipment needed and instructions
2. **Recording Screen** (`recording.tsx`) - Main recording interface with movement type input
3. **Results Screen** (`results.tsx`) - Displays recorded data, statistics, and user feedback

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

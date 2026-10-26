# React Native + Expo setup

This project is a React Native app built with Expo SDK 58 and Expo Router. Follow these steps to install it and run it on a phone, simulator, or web browser.

## 1. Install the prerequisites

- Install Node.js (the current LTS release is recommended). npm is included with Node.js.
- For a phone, install **Expo Go** from the iOS App Store or Google Play.
- For an Android emulator, install Android Studio and create an Android Virtual Device.
- For the iOS Simulator, use a Mac with Xcode installed. The iOS Simulator is not available on Windows.

You can develop on a physical phone without installing Android Studio or Xcode.

## 2. Install project dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

This installs the dependency versions recorded in `package-lock.json`.

## 3. Start the app

Start the Expo development server:

```bash
npm start
```

Then choose how to open the app:

- **Physical phone:** Open Expo Go and scan the QR code shown in the terminal.
- **Android emulator:** Press `a` in the Expo terminal, or run `npm run android`.
- **iOS Simulator:** Press `i` in the Expo terminal, or run `npm run ios` on a Mac.
- **Web browser:** Press `w` in the Expo terminal, or run `npm run web`.

For a phone, keep it and your computer on the same Wi-Fi network. If the QR code does not connect, try tunnel mode:

```bash
npx expo start --tunnel
```

## 4. Make a change

The app uses file-based routing with Expo Router:

- `src/app/index.tsx` is the main screen.
- `src/app/_layout.tsx` defines the root navigation layout.
- `app.json` contains the Expo app configuration.

Save a change in a screen file while the server is running; Fast Refresh will usually show it automatically.

## Adding or updating dependencies

Use Expo's installer for Expo or React Native packages. It selects a version compatible with this project's SDK:

```bash
npx expo install package-name
```

After changing dependencies, check their compatibility:

```bash
npx expo install --check
```

If the check reports incompatible package versions, review the reported changes before applying Expo's suggested fixes:

```bash
npx expo install --fix
```

Some native packages are not included in Expo Go. When adding one, use a development build instead of expecting it to work in Expo Go. See the [Expo development builds guide](https://docs.expo.dev/develop/development-builds/introduction/).

## Useful checks

Check the TypeScript project for errors:

```bash
npx tsc --noEmit
```

Check the Expo project and dependencies:

```bash
npx expo-doctor
```

## Troubleshooting

- **The app cannot connect to the development server:** Confirm your phone and computer are on the same network, then try `npx expo start --tunnel`.
- **A package reports an SDK version mismatch:** Install it with `npx expo install package-name`, then rerun `npx expo install --check`.
- **The app displays stale code or assets:** Stop the server and restart with `npx expo start --clear`.
- **A native package does not work in Expo Go:** Use a development build for this app. Follow the [development builds guide](https://docs.expo.dev/develop/development-builds/introduction/).

## Learn more

- [Expo SDK 58 documentation](https://docs.expo.dev/versions/v58.0.0/)
- [Expo Router introduction](https://docs.expo.dev/router/introduction/)
- [Expo environment setup](https://docs.expo.dev/get-started/set-up-your-environment/)
- [Expo start developing guide](https://docs.expo.dev/get-started/start-developing/)

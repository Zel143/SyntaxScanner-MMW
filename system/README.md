# Syntax Scanner System Documentation

## Architecture Overview
The Syntax Scanner is a 2D interactive prototype built using vanilla web technologies (HTML5, CSS3, JavaScript) and integrated with Google Firebase for data and media storage.

## Folder Structure
```
system/
├── index.html   # Main application structure & SDK loading
├── style.css    # Visual aesthetics & animations
├── script.js     # Core game engine, logic, & Firebase integration
└── README.md    # This documentation
```

## File Documentation

### 1. `index.html`
- **Purpose:** Defines the skeleton of the application.
- **Key Sections:**
  - **Firebase SDKs:** Loads the Firebase App, Firestore, and Storage libraries via CDN.
  - **Game Canvas:** The `<canvas>` element where the 2D world is rendered.
  - **Overlay UI:** Contains the scanner interface (Math Expression display + choice buttons) and the recording controls.
  - **Status Indicators:** Includes the "● REC" blinker for active recording.

### 2. `style.css`
- **Purpose:** Handles the "Cyber-Debugger" visual theme and interactive animations.
- **Key Styles:**
  - **Grid Background:** Styled to look like a digital blueprint.
  - **Scanner UI:** A high-contrast overlay that appears during "zapping" moments.
  - **Animations:** 
    - `flashGreen`: Triggered on correct answers to simulate "restoration."
    - `flashRed`: Triggered on incorrect answers to simulate a "glitch/logic error."
    - `blink`: Used for the recording status indicator.

### 3. `script.js`
- **Purpose:** The core intelligence of the system.
- **Functional Modules:**
  - **Firebase Module:** Initializes connection to your Firebase project. Handles Firestore (telemetry) and Storage (video) operations.
  - **Engine Module:** Manages the 2D render loop, player movement (WASD/Arrows), and collision detection with "glitch" walls.
  - **Scanner Module:** Randomly pulls from the Module 1 dataset (Expressions vs. Sentences) and manages user interaction.
  - **Recording Module:** Uses the `MediaRecorder` API to capture the canvas stream. It automatically uploads the video to Firebase Storage (or downloads locally if Firebase is not configured).

## Setup & Configuration

### Firebase Integration
To enable Cloud Storage and Telemetry:
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Firestore Database** and **Firebase Storage**.
3. Go to Project Settings -> General -> Your Apps -> Web App (`</>`).
4. Copy the `firebaseConfig` object.
5. Paste it into the top of `script.js`.

### Running the System
1. Open `index.html` in any modern web browser.
2. Click **"START RECORDING"** to begin capturing your pitch video.
3. Walk into the red obstacles and correctly identify the math to progress.
4. Click **"STOP RECORDING"** to save your video.

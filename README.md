
# MonsterAPI Whisper Playground

Welcome to the MonsterAPI Whisper Playground! This React template allows you to quickly set up a real-time speech-to-text transcription application using the Whisper model from MonsterAPI.

## Features

- **Live Transcription**: Convert live audio into text almost instantly.
- **Multiple Languages Supported**: Extensive language support to cater to global needs.
- **Ease of Integration**: Simple setup with comprehensive pre-built UI.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine
- A valid MonsterAPI token (you can obtain one from [MonsterAPI](https://monsterapi.ai/))

### Installation

Execute the following command in your terminal to create a new project with the Whisper Playground:

```bash
npx @monsterapi/whisper-playground your_app_name
cd your_app_name
```

### Configuration

1. **Add your MonsterAPI Token**:

   Create a `.env` file in the root directory and add your MonsterAPI token like so:

   ```plaintext
   REACT_APP_MONSTERAPITOKEN=Your_MonsterAPI_Token_Here
   ```

   Replace `Your_MonsterAPI_Token_Here` with the token you obtained from MonsterAPI.

### Run the Application

Start the application by running:

```bash
npm start
```

This command will launch the application on [http://localhost:3000](http://localhost:3000) in your default web browser.

## Usage

The application UI will allow you to:

- **Start/Stop Live Transcription**: Control live audio transcription.
- **Configure Transcription Settings**: Options for transcription format, beam size, speaker numbers, and more.
- **Select Language**: Choose from a variety of languages for transcription.

## Support

For any issues or support, please contact:

- **Email**: support@monsterapi.ai

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

```

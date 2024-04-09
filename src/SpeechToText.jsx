import React, { useState, useRef } from "react";
import MonsterApiClient from "monsterapi";

const client = new MonsterApiClient(process.env.REACT_APP_MONSTERAPITOKEN);

function SpeechToText() {
    const [recording, setRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    let [text, setText] = useState("")
    const mediaRecorderRef = useRef(null);
  
    const startRecording = () => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          setRecording(true);
          const chunks = [];
          mediaRecorderRef.current = new MediaRecorder(stream);
  
          mediaRecorderRef.current.ondataavailable = event => {
            chunks.push(event.data);
          };
  
          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/wav" });
            const audioUrl = URL.createObjectURL(blob);
            setAudioBlob(blob);
            setAudioUrl(audioUrl);
            setAudioChunks(chunks);
          };
  
          mediaRecorderRef.current.start();
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    };
  
    const stopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        setRecording(false);
      }
    };
  
    const handleUpload = async () => {
      if (!audioBlob) return;
  
      try {
        // Create a File object with the audio blob and specify the file name
        const fileName = 'recorded_audio.wav';
        const file = new File([audioBlob], fileName, { type: audioBlob.type });
  
        // Upload the file using client.uploadFile
        const response = await client.uploadFile(file);
        console.log("upload File response ", response)
        const model = 'whisper';
        const data =  {
          transcription_format: "text",
          beam_size: 5,
          best_of: 8,
          num_speakers: 2,
          diarize: "false",
          remove_silence: "false",
          file: response, // Pass the response URL as the file
        }
        const modelResponse = await client.generate(model, data);
        // text = text + "" + modelResponse?.text
        setText([text + modelResponse?.text])
        text = [text + modelResponse?.text]
        console.log("Transcription result:", modelResponse);
        console.log("Transcription result:", modelResponse?.text);
        console.log("Transcription Text:",...text + modelResponse?.text);
        console.log("Transcription Text:",text);
      } catch (error) {
        console.error("Error occurred while transcribing:", error);
      }
    };
  
    return (
      <div>
        <h1>Speech to Text Transcription</h1>

        <div>
        <button onClick={()=>{
          setText("");
          startRecording()
        }} disabled={recording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
        <button onClick={handleUpload} disabled={!audioBlob}>
          Upload & Transcribe
        </button>
        <audio src={audioUrl} controls />

        </div>

        <p >{text[0]}</p>
      </div>
    );
  }
  
  export default SpeechToText;
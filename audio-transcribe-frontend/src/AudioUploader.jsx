import { useState } from "react";
import axios from 'axios';

const AudioUploader = () => {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [audioURL, setAudioURL] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    // Create a URL for the uploaded file to allow preview
    setAudioURL(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an audio file to transcribe.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/api/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscription(response.data);
    } catch (error) {
      console.error("Error Transcribing audio:", error);
      alert("Failed to upload file. Check server logs.");
    }
  };

  return (
    <div className="container">
      <h1>Audio to Text Transcriber</h1>
      <p className="subtitle">Upload an audio file and convert it to text easily!</p>

      {/* File Upload Section */}
      <label className="file-input">
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <span className="file-label">Click here to upload an audio file</span>
      </label>

      {/* Audio Preview Section */}
      {audioURL && (
        <div className="audio-preview">
          <h3>🎧 Listen to Uploaded File</h3>
          <audio controls>
            <source src={audioURL} type={file?.type} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Upload Button */}
      <button className="upload-button" onClick={handleUpload}>
        Upload & Transcribe
      </button>

      {/* Transcription Result */}
      {transcription && (
        <div className="transcription-result">
          <h2>Transcription Result</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}

export default AudioUploader;

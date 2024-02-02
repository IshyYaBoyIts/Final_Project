import React, { useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceRecognition = ({ isListening, onStart, onStop, onTranscript }) => {
  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;

    recognition.onstart = () => onStart && onStart();
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      onTranscript && onTranscript(transcript);
    };
    recognition.onend = () => onStop && onStop();
    recognition.onerror = (event) => console.error('Speech recognition error:', event.error);

    if (isListening) recognition.start();
    else recognition.stop();

    return () => recognition.abort();
  }, [isListening, onStart, onStop, onTranscript]);

  return null; // This component does not render anything
};
export default VoiceRecognition;

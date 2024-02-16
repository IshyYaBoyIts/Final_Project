import React from 'react';
import { formatDateFromSpeech } from './DateProcessing';

// SpeechProcessing.js
export const processTranscript = (transcript) => {
    const words = transcript.toLowerCase().split(' ');
    let currentLabel = '';
    let processed = { name: '', description: '', tag: '', date: '' };

    words.forEach(word => {
        // Check if the word is a label
        if (['name', 'description', 'tag', 'date'].includes(word)) {
            // If the current label is 'date', format the date before moving on
            if (currentLabel === 'date' && processed.date) {
                processed.date = formatDateFromSpeech(processed.date.trim());
            }
            currentLabel = word; // Update the current label to the new label
        } else {
            // If it's not a label, append the word to the current label's value
            // Only append if there is a current label to avoid initial words without a label
            if (currentLabel) {
                processed[currentLabel] += `${processed[currentLabel] ? ' ' : ''}${word}`;
            }
        }
    });

    // After processing all words, check if the last label was 'date' and format it
    if (currentLabel === 'date' && processed.date) {
        processed.date = formatDateFromSpeech(processed.date.trim());
    }

    return processed;
};

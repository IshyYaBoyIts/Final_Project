// eslint-disable-next-line no-unused-vars
import React from 'react';
import { formatDateFromSpeech } from './DateProcessing'; 


// SpeechProcessing.js
export const processTranscript = (transcript) => {
    const words = transcript.toLowerCase().split(' ');
    let currentLabel = '';
    let processed = { name: '', description: '', tag: '', date: '' };

    words.forEach(word => {
        switch (currentLabel) {
            case 'name':
            case 'description':
            case 'tag':
                if (word !== 'date') processed[currentLabel] += `${processed[currentLabel] ? ' ' : ''}${word}`;
                else currentLabel = 'date';
                break;
            case 'date':
                processed[currentLabel] += `${processed[currentLabel] ? ' ' : ''}${word}`;
                break;
            default:
                if (word === 'name' || word === 'description' || word === 'tag' || word === 'date') currentLabel = word;
        }
    });

    if (processed.date) {
        processed.date = formatDateFromSpeech(processed.date);
    }

    return processed;
};

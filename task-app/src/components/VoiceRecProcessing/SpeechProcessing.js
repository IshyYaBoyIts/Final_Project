// eslint-disable-next-line no-unused-vars
import React from 'react';

const processTranscript = (transcript) => {
    // Split the transcript by spaces to process each word
    const words = transcript.toLowerCase().split(' ');
    let currentLabel = '';
    let processed = {
        name: '',
        description: '',
        tag: '',
        date: ''
    };

    // Iterate through each word in the transcript
    words.forEach(word => {
        if (word === 'name' || word === 'description' || word === 'tag' || word === 'date') {
            currentLabel = word; // Update current label when one of the keywords is found
        } else {
            if (currentLabel) {
                // Append the word to the correct label
                processed[currentLabel] += (processed[currentLabel] ? ' ' : '') + word;
            }
        }
    });

    // Format date if present
    if (processed.date) {
        processed.date = formatDateFromSpeech(processed.date);
    }

    return processed;
};

const formatDateFromSpeech = (dateSpeech) => {
    // Assuming dateSpeech is "ddmmyyyy" or "ddmmyy"
    const day = dateSpeech.substring(0, 2);
    const month = dateSpeech.substring(2, 4);
    let year = dateSpeech.substring(4);

    // If year is provided as two digits, assume it's in the 2000s
    if (year.length === 2) {
        year = '20' + year;
    }

    // Return the date in YYYY-MM-DD format for consistency
    return `${year}-${month}-${day}`;
};

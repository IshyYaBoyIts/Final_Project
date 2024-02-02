// eslint-disable-next-line no-unused-vars
import React from 'react';


export const formatDateFromSpeech = (dateSpeech) => {
    // Enhanced regex to include optional spaces and handle different separators
    const regex = /(\d{1,2})\s*[-/\s]\s*(\d{1,2})\s*[-/\s]\s*(\d{2,4})/;
    const match = dateSpeech.match(regex);
    if (match) {
        let [day, month, year] = match;
        day = day.padStart(2, '0');
        month = month.padStart(2, '0');
        year = year.length === 2 ? `20${year}` : year;
        return `${year}-${month}-${day}`;
    }
    return ''; // Return an empty string if the date format doesn't match
};

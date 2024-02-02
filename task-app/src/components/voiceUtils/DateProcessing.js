// eslint-disable-next-line no-unused-vars
import React from 'react';


export const formatDateFromSpeech = (dateSpeech) => {
    // This function needs to correctly parse dateSpeech and return a date in YYYY-MM-DD format
    const regex = /(\d{1,2})\s+(\d{1,2})\s+(\d{4})/;
    const match = dateSpeech.match(regex);
    if (match) {
        // eslint-disable-next-line no-unused-vars
        const [_, day, month, year] = match.map(num => String(num).padStart(2, '0'));
        return `${day}-${month}-${year}`;
    }
    // Handle different or unexpected formats appropriately
    return '';
};


// eslint-disable-next-line no-unused-vars
import React from 'react';

export const formatDateFromSpeech = (dateSpeech) => {
    console.log('Received for date processing:', dateSpeech);

    // Remove ordinal suffixes and convert month names to numbers
    const monthNames = ["january", "february", "march", "april", "may", "june",
                        "july", "august", "september", "october", "november", "december"];
    
    let standardizedDate = dateSpeech.toLowerCase().replace(/(\d+)(st|nd|rd|th)/g, "$1").split(' ').map(word => {
        // Handle month names conversion to numbers
        const monthIndex = monthNames.indexOf(word);
        if (monthIndex !== -1) return String(monthIndex + 1).padStart(2, '0');
        return word;
    }).join(' ');

    console.log('Standardized date:', standardizedDate);

    // Match various date formats, including "DD MM YYYY", "DDth of Month YYYY", and compact "DDMMYYYY"
    const regexPatterns = [
        /(\d{1,2})\s*of\s*(\d{1,2})\s*(\d{2,4})/, // Matches "5 of 03 2024"
        /(\d{1,2})\s*(\d{1,2})\s*(\d{2,4})/,      // Matches standard "DD MM YYYY"
        /^(\d{2})(\d{2})(\d{4})$/                // Matches compact "DDMMYYYY"
    ];

    let match = null;
    for (let regex of regexPatterns) {
        match = standardizedDate.match(regex);
        if (match) break;
    }

    if (match) {
        let [_, day, month, year] = match;
        day = day.padStart(2, '0');
        month = month.padStart(2, '0');
        // Handle two-digit year (assuming 21st century)
        year = year.length === 2 ? `20${year}` : year;
        const formattedDate = `${day}/${month}/${year}`;
        console.log('Formatted date:', formattedDate);
        return formattedDate;
    }

    console.log('Could not parse date from speech:', dateSpeech);
    return '';
};

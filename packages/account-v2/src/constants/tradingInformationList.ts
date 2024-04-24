const experienceRange = ['0-1 year', '1-2 years', 'Over 3 years'];

const frequencyRange = [
    '0-5 transactions in the past 12 months',
    '6-10 transactions in the past 12 months',
    '11-39 transactions in the past 12 months',
    '40 transactions or more in the past 12 months',
];

export const binaryOptionsTradingExperienceList = experienceRange.map(range => ({
    text: range,
    value: range,
}));

export const binaryOptionsTradingFrequencyList = frequencyRange.map(range => ({
    text: range,
    value: range,
}));

export const cfdTradingExperienceList = [...binaryOptionsTradingExperienceList];

export const cfdTradingFrequencyList = [...binaryOptionsTradingFrequencyList];

export const forexTradingExperienceList = [...binaryOptionsTradingExperienceList];

export const forexTradingFrequencyList = [...binaryOptionsTradingFrequencyList];

export const otherInstrumentsTradingExperienceList = [...binaryOptionsTradingExperienceList];

export const otherInstrumentsTradingFrequencyList = [...binaryOptionsTradingFrequencyList];

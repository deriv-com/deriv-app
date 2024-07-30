import React from 'react';

const replaceValue = (text, values) => {
    const valueMatch = text.match(/{{(\w+)}}/);
    if (valueMatch) {
        const valueKey = valueMatch[1];
        return values[valueKey] || text;
    }
    return text;
};

const Localize = ({ i18n_default_text, components = [], values = {} }) => {
    // Split text into parts, extracting placeholders for components
    const parts = i18n_default_text.split(/(<\d+>.*?<\/\d+>|{{\w+}})/g);

    return (
        <>
            {parts.map((part, index) => {
                // Handle component placeholders
                const componentMatch = part.match(/<(\d+)>(.*?)<\/\1>/);
                if (componentMatch) {
                    const componentIndex = parseInt(componentMatch[1]);
                    const content = replaceValue(componentMatch[2], values);
                    const Component = components[componentIndex];
                    return Component ? React.cloneElement(Component, { key: index, children: content }) : content;
                }
                // Replace placeholders with actual values
                return replaceValue(part, values);
            })}
        </>
    );
};

const mockFn = jest.fn((text, args) => {
    return text.replace(/{{(.*?)}}/g, (_, match) => args[match.trim()]);
});

// Mock for useTranslations hook
const useTranslations = () => ({
    localize: mockFn,
    currentLang: 'EN',
});

const localize = mockFn;

const getAllowedLanguages = jest.fn(() => ({ EN: 'English', VI: 'Tiếng Việt' }));

export { Localize, localize, useTranslations, getAllowedLanguages };
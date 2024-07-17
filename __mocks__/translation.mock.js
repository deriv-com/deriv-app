import React from 'react';

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
                    const content = componentMatch[2];
                    const Component = components[componentIndex];
                    return Component ? React.cloneElement(Component, { key: index, children: content }) : content;
                }
                // Replace placeholders with actual values
                const valueMatch = part.match(/{{(\w+)}}/);
                if (valueMatch) {
                    const valueKey = valueMatch[1];
                    return values[valueKey] || part;
                }
                return part;
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

import React from 'react';

const Localize = ({ i18n_default_text, components = [], values = {} }) => {
    // Split text into parts, extracting placeholders for components and values
    const parts = i18n_default_text.split(/(<\d+>.*?<\/\d+>|{{\w+}})/g);

    const replaceValues = text => {
        return text.replace(/{{(\w+)}}/g, (match, key) => values[key] || match);
    };

    return (
        <>
            {parts.map((part, index) => {
                // Replace component placeholders with actual components
                const componentMatch = part.match(/<(\d+)>(.*?)<\/\1>/);

                if (componentMatch) {
                    const componentIndex = parseInt(componentMatch[1]);

                    // Replace values wrapped in components with actual values
                    const content = replaceValues(componentMatch[2]);
                    const Component = components[componentIndex];
                    return Component ? React.cloneElement(Component, { key: index, children: content }) : content;
                }

                // Replace value placeholders with actual values
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

// Mock for useTranslations hook
const useTranslations = () => ({
    localize: jest.fn((text, args) => {
        return text.replace(/{{(.*?)}}/g, (_, match) => args[match.trim()]);
    }),
    currentLang: 'EN',
});

const localize = jest.fn(text => text);

const getAllowedLanguages = jest.fn(() => ({ EN: 'English', VI: 'Tiếng Việt' }));

export { Localize, localize, useTranslations, getAllowedLanguages };

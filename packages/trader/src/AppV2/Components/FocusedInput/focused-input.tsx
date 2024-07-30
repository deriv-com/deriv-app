import React from 'react';
import './focused-input.scss';

export const focusAndOpenKeyboard = (element: HTMLInputElement | null) => {
    if (element) {
        // Align temporary input element approximately where the real input element is
        // so the cursor doesn't jump around
        const placeholder_element = document.createElement('input');
        // placeholder_element.style.position = 'absolute';
        // placeholder_element.style.top = `${element.offsetTop + 7}px`;
        // placeholder_element.style.left = `${element.offsetLeft}px`;
        placeholder_element.style.height = '0px';
        placeholder_element.style.opacity = '0px';
        // Put this temporary input element as a child of the page <body> and focus on it
        document.body.appendChild(placeholder_element);
        placeholder_element.focus({ preventScroll: true });

        // The keyboard is open, so now adding a delayed focus on the target element and remove temporary input element
        return setTimeout(() => {
            element.focus();
            element.click();
            document.body.removeChild(placeholder_element);
        }, 300);
    }
};

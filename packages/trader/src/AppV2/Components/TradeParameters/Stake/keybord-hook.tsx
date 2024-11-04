import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';

const useKeyboardVisibility = (): {
    isKeyboardOpen: boolean;
    scrollRequired: boolean;
} => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
    const [scrollRequired, setScrollRequired] = useState<boolean>(false);
    const [previousHeight, setPreviousHeight] = useState<number>(window.innerHeight);
    const [previousVisualHeight, setPreviousVisualHeight] = useState<number>(
        window.visualViewport?.height || window.innerHeight
    );

    const handleResize = () => {
        const currentHeight = window.innerHeight;
        const currentVisualHeight = window.visualViewport?.height || currentHeight;

        const keyboardIsOpen = currentHeight < previousHeight || currentVisualHeight < previousVisualHeight;

        const element = document.querySelector<HTMLElement>('.trade');
        const documentHeight = element?.scrollHeight || 0;
        const viewportHeight = currentVisualHeight;

        if (keyboardIsOpen) {
            setIsKeyboardOpen(true);
            setScrollRequired(documentHeight > viewportHeight);
        } else {
            setIsKeyboardOpen(false);
            setScrollRequired(false);
        }

        // Update previous heights
        setPreviousHeight(currentHeight);
        setPreviousVisualHeight(currentVisualHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', debounce(handleResize, 200));
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', debounce(handleResize, 200));
            }
        };
    }, []);

    return { isKeyboardOpen, scrollRequired };
};

export default useKeyboardVisibility;

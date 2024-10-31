import { useEffect, useState } from 'react';

const useKeyboardVisibility = (): {
    isKeyboardOpen: boolean;
    scrollRequired: boolean;
} => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
    const [scrollRequired, setScrollRequired] = useState<boolean>(false);
    let previousHeight = window.innerHeight;
    let previousVisualHeight = window.visualViewport?.height || previousHeight;

    const handleResize = () => {
        const currentHeight = window.innerHeight;
        const currentVisualHeight = window.visualViewport?.height || currentHeight;

        const keyboardIsOpen = currentHeight < previousHeight || currentVisualHeight < previousVisualHeight;

        if (keyboardIsOpen) {
            setIsKeyboardOpen(true);
            const documentHeight = document.documentElement.scrollHeight;
            const viewportHeight = currentVisualHeight;

            // Determine if scrolling is required
            setScrollRequired(documentHeight > viewportHeight);
        } else {
            setIsKeyboardOpen(false);
            setScrollRequired(false);
        }

        // Update previous heights
        previousHeight = currentHeight;
        previousVisualHeight = currentVisualHeight;
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    return { isKeyboardOpen, scrollRequired };
};

export default useKeyboardVisibility;

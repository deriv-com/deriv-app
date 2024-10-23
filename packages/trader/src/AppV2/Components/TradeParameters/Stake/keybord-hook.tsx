import React from 'react';

const isKeyboardInput = (elem: HTMLElement) =>
    (elem.tagName === 'INPUT' &&
        !['button', 'submit', 'checkbox', 'file', 'image'].includes((elem as HTMLInputElement).type)) ||
    elem.hasAttribute('contenteditable');

const useIsOnScreenKeyboardOpen = () => {
    const [isOpen, setOpen] = React.useState(false);
    React.useEffect(() => {
        const handleFocusIn = (e: FocusEvent) => {
            if (!e.target) {
                return;
            }
            const target = e.target as HTMLElement;
            if (isKeyboardInput(target)) {
                setOpen(true);
            }
        };
        document.addEventListener('focusin', handleFocusIn);
        const handleFocusOut = (e: FocusEvent) => {
            if (!e.target) {
                return;
            }
            const target = e.target as HTMLElement;
            if (isKeyboardInput(target)) {
                setOpen(false);
            }
        };
        document.addEventListener('focusout', handleFocusOut);

        return () => {
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('focusout', handleFocusOut);
        };
    }, []);

    return isOpen;
};

export default useIsOnScreenKeyboardOpen;

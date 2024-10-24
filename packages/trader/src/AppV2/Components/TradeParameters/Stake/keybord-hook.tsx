import React from 'react';

const isKeyboardInput = (elem: HTMLElement, target_id: string) =>
    elem.id === target_id &&
    ((elem.tagName === 'INPUT' &&
        !['button', 'submit', 'checkbox', 'file', 'image'].includes((elem as HTMLInputElement).type)) ||
        elem.hasAttribute('contenteditable'));

const useIsOnScreenKeyboardOpen = (target_id: string) => {
    const [is_focus, setIsFocus] = React.useState(false);
    const [is_open, setIsOpen] = React.useState(false);

    const RATIO = 0.75;

    React.useEffect(() => {
        const handleFocusIn = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (!e.target) return;
            if (isKeyboardInput(target, target_id)) setIsFocus(true);
        };
        const handleFocusOut = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (!e.target) return;
            if (isKeyboardInput(target, target_id)) setIsFocus(false);
        };
        const resizeHandler = (e: any) => {
            const has_keyboard_changed_viewport = (e.target.height * e.target.scale) / window.screen.height < RATIO;
            setIsOpen(has_keyboard_changed_viewport);
        };

        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);
        window?.visualViewport?.addEventListener('resize', resizeHandler);

        return () => {
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('focusout', handleFocusOut);
            window?.visualViewport?.removeEventListener('resize', resizeHandler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return is_focus && is_open;
};

export default useIsOnScreenKeyboardOpen;

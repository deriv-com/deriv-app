import React from 'react';

const isKeyboardInput = (elem: HTMLElement) =>
    (elem.tagName === 'INPUT' &&
        !['button', 'submit', 'checkbox', 'file', 'image'].includes((elem as HTMLInputElement).type)) ||
    elem.hasAttribute('contenteditable');

const useIsOnScreenKeyboardOpen = () => {
    const [is_focus, setIsFocus] = React.useState(false);
    const [is_open, setIsOpen] = React.useState(false);

    const VIEWPORT_VS_CLIENT_HEIGHT_RATIO = 0.75;

    React.useEffect(() => {
        const handleFocusIn = (e: FocusEvent) => {
            if (!e.target) {
                return;
            }
            const target = e.target as HTMLElement;
            if (isKeyboardInput(target) && target.id === 'stake_input') {
                setIsFocus(true);
                setTimeout(
                    () =>
                        document
                            .querySelector('#test_button')
                            ?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' }),
                    800
                );
            }
        };
        const handleFocusOut = (e: FocusEvent) => {
            if (!e.target) {
                return;
            }
            const target = e.target as HTMLElement;
            if (isKeyboardInput(target)) {
                setIsFocus(false);
            }
        };
        const resizeHandler = (e: any) => {
            if ((e.target.height * e.target.scale) / window.screen.height < VIEWPORT_VS_CLIENT_HEIGHT_RATIO) {
                setIsOpen(true);
            } else setIsOpen(false);
        };

        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);
        window?.visualViewport?.addEventListener('resize', resizeHandler);

        return () => {
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('focusout', handleFocusOut);
            window?.visualViewport?.removeEventListener('resize', resizeHandler);
        };
    }, []);

    return is_focus && is_open;
};

export default useIsOnScreenKeyboardOpen;

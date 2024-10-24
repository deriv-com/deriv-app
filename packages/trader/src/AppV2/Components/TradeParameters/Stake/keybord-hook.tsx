import React from 'react';

type TWindow = Window & { height?: number; scale?: number };

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
        const handleFocus = (e: FocusEvent) => {
            const target = e.target;
            const is_focus_in = e.type === 'focusin';

            if (!target) return;
            if (isKeyboardInput(target as HTMLElement, target_id)) setIsFocus(is_focus_in);
        };

        const resizeHandler = (e: Event) => {
            const target = e.target as TWindow;
            if (!target || !target?.height || !target?.scale) return;
            const has_keyboard_changed_viewport = (target.height * target.scale) / window.screen.height < RATIO;
            setIsOpen(has_keyboard_changed_viewport);
        };

        document.addEventListener('focusin', handleFocus);
        document.addEventListener('focusout', handleFocus);
        window.visualViewport?.addEventListener('resize', resizeHandler);

        return () => {
            document.removeEventListener('focusin', handleFocus);
            document.removeEventListener('focusout', handleFocus);
            window.visualViewport?.removeEventListener('resize', resizeHandler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return is_focus && is_open;
};

export default useIsOnScreenKeyboardOpen;

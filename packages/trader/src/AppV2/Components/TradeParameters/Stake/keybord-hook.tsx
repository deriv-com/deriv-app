import React from 'react';

const useIsOnScreenKeyboardOpen = (target_id: string) => {
    const [is_focus, setIsFocus] = React.useState(false);

    React.useEffect(() => {
        const handleFocus = (e: FocusEvent) => {
            const target = e.target;
            const is_focus_in = e.type === 'focusin';

            if (!target) return;
            if ((target as HTMLElement).id === target_id) setIsFocus(is_focus_in);
        };

        document.addEventListener('focusin', handleFocus);
        document.addEventListener('focusout', handleFocus);

        return () => {
            document.removeEventListener('focusin', handleFocus);
            document.removeEventListener('focusout', handleFocus);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return is_focus;
};

export default useIsOnScreenKeyboardOpen;

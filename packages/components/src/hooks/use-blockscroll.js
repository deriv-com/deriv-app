import React from 'react';

export const useBlockScroll = target_ref => {
    React.useEffect(() => {
        if (!target_ref) return undefined;

        const blockScroll = event => {
            if (target_ref?.current && !target_ref.current.contains(event.target)) {
                event.preventDefault();
            }
        };

        document.body.addEventListener('mousewheel', blockScroll, { capture: true, passive: false });
        document.body.addEventListener('touchmove', blockScroll, { capture: true, passive: false });

        return () => {
            document.body.removeEventListener('mousewheel', blockScroll, { capture: true, passive: false });
            document.body.removeEventListener('touchmove', blockScroll, { capture: true, passive: false });
        };
    }, [target_ref]);
};

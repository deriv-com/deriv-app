import React from 'react';

export const useBlockScroll = target_ref => {
    React.useEffect(() => {
        if (!target_ref) return undefined;

        const blockScroll = event => {
            if (target_ref?.current && !target_ref.current.contains(event.target)) {
                event.preventDefault();
            }
        };

        document.addEventListener('mousewheel', blockScroll, { passive: false });
        document.addEventListener('touchmove', blockScroll, { passive: false });

        return () => {
            document.removeEventListener('mousewheel', blockScroll, { passive: false });
            document.removeEventListener('touchmove', blockScroll, { passive: false });
        };
    }, [target_ref]);
};

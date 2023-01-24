import React from 'react';

export const usePreventIOSZoom = () => {
    React.useEffect(() => {
        // Fix to prevent iOS from zooming in erratically on quick taps
        const preventIOSZoom = (event: TouchEvent) => {
            if (event.touches.length > 1) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        document.addEventListener('touchstart', event => preventIOSZoom(event), { passive: false });

        return () => {
            document.removeEventListener('touchstart', event => preventIOSZoom(event));
        };
    }, []);
};

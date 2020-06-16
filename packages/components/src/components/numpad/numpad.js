import React from 'react';

export const useLongPress = (callback = () => {}, ms = 300) => {
    const [startLongPress, setStartLongPress] = React.useState(false);

    const preventDefaults = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    React.useEffect(() => {
        let timer;
        if (startLongPress) {
            timer = setTimeout(callback, ms);
        } else {
            clearTimeout(timer);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [startLongPress]);

    return {
        onMouseDown: e => {
            preventDefaults(e);
            setStartLongPress(true);
        },
        onMouseUp: () => setStartLongPress(false),
        onMouseLeave: () => setStartLongPress(false),
        onTouchStart: e => {
            preventDefaults(e);
            setStartLongPress(true);
        },
        onTouchEnd: () => setStartLongPress(false),
    };
};

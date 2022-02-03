import React from 'react';

export const useLongPress = (
    callback = () => {
        /** empty function */
    },
    ms = 300
) => {
    const [startLongPress, setStartLongPress] = React.useState(false);

    const preventDefaults = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    React.useEffect(() => {
        let timer;
        if (startLongPress) {
            timer = setTimeout(callback, ms);
        } else if (timer) {
            clearTimeout(timer);
        }

        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

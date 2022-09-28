import React from 'react';

export const useIsMounted = () => {
    const is_mounted = React.useRef(false);

    React.useEffect(() => {
        is_mounted.current = true;

        return () => {
            is_mounted.current = false;
        };
    }, []);
    return () => is_mounted.current;
};

import React from 'react';

export const usePrevious = <T>(value: T) => {
    const ref = React.useRef<T | undefined>();
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

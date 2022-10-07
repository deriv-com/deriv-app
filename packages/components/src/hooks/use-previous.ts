import React from 'react';

export const usePrevious = (value: any) => {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

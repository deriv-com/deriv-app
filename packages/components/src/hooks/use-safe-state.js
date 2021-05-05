import * as React from 'react';

export const useSafeState = (initial_state, optIsMountedFunc = null) => {
    const [state, setState] = React.useState(initial_state);
    const is_mounted = React.useRef(false);

    React.useLayoutEffect(() => {
        is_mounted.current = true;
        return () => (is_mounted.current = false);
    }, []);

    const isMounted = () => {
        if (typeof optIsMountedFunc === 'function') {
            return optIsMountedFunc();
        }

        return is_mounted.current === true;
    };

    const wrappedSetState = value => {
        if (isMounted()) {
            setState(value);
        }
    };

    return [state, wrappedSetState];
};

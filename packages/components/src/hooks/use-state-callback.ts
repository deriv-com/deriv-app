import React from 'react';

// this hook mimics this.setState({ state: value, ... }, () => callbackFunc());
export const useStateCallback = <T>(initial_state: T) => {
    const [state, setState] = React.useState<T>(initial_state);
    const callbackRef = React.useRef<((param: T) => void) | null>(null); // a mutable ref to store existing callback

    const setStateCallback = React.useCallback((current_state: T, cb: (param: T) => void) => {
        callbackRef.current = cb; // store the passed callback to the ref
        setState(current_state);
    }, []);

    React.useEffect(() => {
        // callback ref current is null on initial render, so we only execute callback on state
        if (callbackRef.current) {
            callbackRef.current(state);
            callbackRef.current = null; // we need to reset the callback after execution
        }
    }, [state]);

    return [state, setStateCallback];
};

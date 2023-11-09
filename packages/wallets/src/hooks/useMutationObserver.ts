import { RefObject, useEffect } from 'react';

/** A custom hook to observe DOM elements */
const useMutationObserver = (
    ref: RefObject<HTMLElement>,
    callback: MutationCallback,
    options: MutationObserverInit = {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
    }
) => {
    useEffect(() => {
        if (ref.current) {
            const observer = new MutationObserver(callback);
            observer.observe(ref.current, options);
            return () => observer.disconnect();
        }
    }, [callback, options, ref]);
};

export default useMutationObserver;

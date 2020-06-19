import React from 'react';

function useOnClickOutside(ref, handler, validationFn) {
    React.useEffect(() => {
        const listener = event => {
            const path = event.path ?? event.composedPath?.();

            if (
                ref &&
                (!ref.contains(event.target) && !ref.contains(path[0])) // When component is isolated (e.g, iframe, shadow DOM) event.target refers to whole container not the component. path[0] is the node that the event originated from, it does not need to walk the array
            ) {
                if (validationFn && validationFn()) {
                    handler(event);
                }
            }
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}

export { useOnClickOutside };

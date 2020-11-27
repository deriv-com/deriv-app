import React from 'react';

export const useOnClickOutside = (ref, handler, validationFn) => {
    React.useEffect(() => {
        const listener = event => {
            const path = event.path ?? event.composedPath?.();

            // When component is isolated (e.g, iframe, shadow DOM) event.target refers to whole container not the component. path[0] is the node that the event originated from, it does not need to walk the array
            if (ref && ref.current && !ref.current.contains(event.target) && !ref.current.contains(path && path[0])) {
                if (validationFn && !validationFn(event)) return;
                handler(event);
            }
        };

        document.addEventListener('mousedown', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [ref, handler]);
};

import React, { RefObject } from 'react';

export const useOnClickOutside = (
    ref: RefObject<HTMLElement>,
    handler: (event: MouseEvent) => void,
    validationFn: (event: MouseEvent) => boolean
) => {
    React.useEffect(() => {
        const listener = (event: MouseEvent) => {
            const path = event.composedPath?.()[0] ?? (event as MouseEvent & { path: HTMLElement }).path; //event.path is non-standard and will be deprecated
            // When component is isolated (e.g, iframe, shadow DOM) event.target refers to whole container not the component. path[0] is the node that the event originated from, it does not need to walk the array
            if (
                ref &&
                ref.current &&
                !ref.current.contains(event.target as HTMLElement) &&
                !ref.current.contains(path as HTMLElement)
            ) {
                if (validationFn && !validationFn(event)) return;
                handler(event);
            }
        };

        document.addEventListener('mousedown', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [ref, handler, validationFn]);
};

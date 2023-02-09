import React, { RefObject } from 'react';

export interface IClickEvent extends MouseEvent {
    path?: HTMLElement[];
}

export const useOnClickOutside = (
    ref: RefObject<HTMLElement>,
    handler: (event?: IClickEvent) => void,
    validationFn: (event: IClickEvent) => boolean
) => {
    React.useEffect(() => {
        const listener = (event: IClickEvent) => {
            const path = (event.composedPath?.()[0] ?? event.path) as HTMLElement; //event.path is non-standard and will be deprecated
            // When component is isolated (e.g, iframe, shadow DOM) event.target refers to whole container not the component. path[0] is the node that the event originated from, it does not need to walk the array
            if (
                ref &&
                ref.current &&
                !ref.current.contains(event.target as HTMLElement) &&
                !ref.current.contains(path)
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

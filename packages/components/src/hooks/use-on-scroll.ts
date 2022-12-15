import React, { RefObject } from 'react';

export const useOnScroll = (ref: RefObject<HTMLElement>, callback: EventListener) => {
    // Allow consumer to prematurely dispose this scroll listener.
    const remover = React.useRef<(() => void) | null>(null);
    const has_removed = React.useRef(false);

    const diposeListener = () => {
        if (remover.current) {
            remover.current();
            has_removed.current = true;
        }
    };

    React.useEffect(() => {
        // Re-attach event listener on ref update, but only when the user
        // hasn't already disposed the scroll listener.
        if (ref?.current && !has_removed.current) {
            ref.current.addEventListener('scroll', callback);

            remover.current = () => {
                ref.current!.removeEventListener('scroll', callback);
            };
        }

        return diposeListener;
    }, [callback, ref]);

    return diposeListener;
};

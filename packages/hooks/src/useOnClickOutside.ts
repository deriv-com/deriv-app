import { useEffect, useRef } from 'react';

/**
 * Custom hook that listens for clicks outside of a component
 * @example
 * const ref = useOnClickOutside(() => setIsOpen(false));
 * return <div ref={ref}>...</div>;
 *
 * @param callback - callback function to be called when clicking outside of the component
 * @returns ref - ref to the component that is being clicked outside of
 */
const useOnClickOutside = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Close popover when clicking outside of it
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (ref.current && !ref.current.contains(target)) {
                callback();
            }
        };
        // Bind the event listener to the document so it can listen for events that happen outside of the component
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            // Unbind the event listener on clean up when component unmounts
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [callback]);
    return ref;
};

export default useOnClickOutside;

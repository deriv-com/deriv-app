import React, { RefObject } from 'react';

export const useHover = <T extends HTMLElement | SVGSVGElement>(
    refSetter?: RefObject<T> | null,
    should_prevent_bubbling?: boolean
) => {
    const [value, setValue] = React.useState(false);
    const default_ref = React.useRef(null);
    const ref = refSetter || default_ref;

    React.useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const events = should_prevent_bubbling
            ? { enter: 'mouseenter', leave: 'mouseleave' }
            : { enter: 'mouseover', leave: 'mouseout' };

        node.addEventListener(events.enter, () => setValue(true));

        return () => {
            node.removeEventListener(events.enter, () => setValue(true));
            setValue(false);
        };
    }, [ref, should_prevent_bubbling]);

    return [ref, value] as const;
};

export const useHoverCallback = () => {
    const [value, setValue] = React.useState(false);

    const handleMouseOver = React.useCallback(() => setValue(true), []);
    const handleMouseOut = React.useCallback(() => setValue(false), []);
    const ref = React.useRef<HTMLElement | null>(null);

    const callbackRef = React.useCallback(
        (node: HTMLElement) => {
            if (ref.current) {
                ref.current.removeEventListener('mouseover', handleMouseOver);
                ref.current.removeEventListener('mouseout', handleMouseOut);
            }

            ref.current = node;

            if (ref.current) {
                ref.current.addEventListener('mouseover', handleMouseOver);
                ref.current.addEventListener('mouseout', handleMouseOut);
            }
        },
        [handleMouseOver, handleMouseOut]
    );

    return [callbackRef, value];
};

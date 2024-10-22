import React, { RefObject } from 'react';

export const useHover = <T extends HTMLElement | SVGSVGElement>(
    refSetter?: RefObject<T> | null,
    should_prevent_bubbling?: boolean
) => {
    const [value, setValue] = React.useState(false);
    const default_ref = React.useRef(null);
    const ref = refSetter || default_ref;

    const handleHoverBegin = () => setValue(true);
    const handleHoverFinish = React.useCallback(() => {
        if (ref.current) {
            setValue(false);
        }
    }, [ref]);

    React.useEffect(() => {
        const node = ref.current;
        if (node) {
            if (should_prevent_bubbling) {
                node.addEventListener('mouseenter', handleHoverBegin);
                node.addEventListener('mouseleave', handleHoverFinish);
            } else {
                node.addEventListener('mouseover', handleHoverBegin);
                node.addEventListener('mouseout', handleHoverFinish);
            }

            return () => {
                if (should_prevent_bubbling) {
                    node.removeEventListener('mouseenter', handleHoverBegin);
                    node.removeEventListener('mouseleave', handleHoverFinish);
                } else {
                    node.removeEventListener('mouseover', handleHoverBegin);
                    node.removeEventListener('mouseout', handleHoverFinish);
                }
            };
        }
        return undefined;
    }, [handleHoverFinish, ref, should_prevent_bubbling]);

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

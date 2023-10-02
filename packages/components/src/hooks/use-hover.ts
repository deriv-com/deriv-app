import React, { RefObject } from 'react';
import { isMobileOs } from '@deriv/shared';

export const useHover = <T extends HTMLElement & SVGSVGElement>(
    refSetter?: RefObject<T> | null,
    should_prevent_bubbling?: boolean
) => {
    const [value, setValue] = React.useState(false);
    const default_ref = React.useRef(null);
    const ref = refSetter || default_ref;

    const handleHoverBegin = () => setValue(true);
    const handleHoverFinish = () => setValue(false);

    React.useEffect(() => {
        const node = ref.current;

        if (!node) return;

        const handleAddEvents = () => {
            if (isMobileOs()) {
                node.addEventListener('touchstart', handleHoverBegin);
                node.addEventListener('touchend', handleHoverFinish);
            } else {
                node.addEventListener(should_prevent_bubbling ? 'mouseenter' : 'mouseover', handleHoverBegin);
                node.addEventListener(should_prevent_bubbling ? 'mouseleave' : 'mouseout', handleHoverFinish);
            }
        };

        const handleRemoveEvents = () => {
            if (isMobileOs()) {
                node.removeEventListener('touchstart', handleHoverBegin);
                node.removeEventListener('touchend', handleHoverFinish);
            } else {
                node.removeEventListener(should_prevent_bubbling ? 'mouseenter' : 'mouseover', handleHoverBegin);
                node.removeEventListener(should_prevent_bubbling ? 'mouseleave' : 'mouseout', handleHoverFinish);
            }
        };

        handleAddEvents();

        return handleRemoveEvents;
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

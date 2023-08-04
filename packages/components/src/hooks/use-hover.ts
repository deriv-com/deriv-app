import React, { RefObject } from 'react';

export const useHover = <T extends HTMLElement & SVGSVGElement>(
    refSetter?: RefObject<T> | null,
    should_prevent_bubbling?: boolean
) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const [value, setValue] = React.useState(false);
    const default_ref = React.useRef(null);
    const ref = refSetter || default_ref;

    const handleHoverBegin = () => setValue(true);
    const handleHoverFinish = () => setValue(false);

    React.useEffect(() => {
        const node = ref.current;

        if (!node) return;

        const addMouseEnterEvent = () => {
            if (isMobile) {
                node.addEventListener('touchstart', handleHoverBegin);
                node.addEventListener('touchend', handleHoverFinish);
            } else {
                node.addEventListener('mouseenter', handleHoverBegin);
                node.addEventListener('mouseleave', handleHoverFinish);
            }
        };

        const removeMouseEnterEvent = () => {
            if (isMobile) {
                node.removeEventListener('touchstart', handleHoverBegin);
                node.removeEventListener('touchend', handleHoverFinish);
            } else {
                node.removeEventListener('mouseenter', handleHoverBegin);
                node.removeEventListener('mouseleave', handleHoverFinish);
            }
        };

        const addMouseOverEvent = () => {
            if (isMobile) {
                node.addEventListener('touchstart', handleHoverBegin);
                node.addEventListener('touchend', handleHoverFinish);
            } else {
                node.addEventListener('mouseover', handleHoverBegin);
                node.addEventListener('mouseout', handleHoverFinish);
            }
        };

        const removeMouseOverEvent = () => {
            if (isMobile) {
                node.removeEventListener('touchstart', handleHoverBegin);
                node.removeEventListener('touchend', handleHoverFinish);
            } else {
                node.removeEventListener('mouseover', handleHoverBegin);
                node.removeEventListener('mouseout', handleHoverFinish);
            }
        };

        const removeEventListerner = () => {
            if (should_prevent_bubbling) {
                removeMouseEnterEvent();
            } else {
                removeMouseOverEvent();
            }
        };

        if (should_prevent_bubbling) {
            addMouseEnterEvent();
        } else {
            addMouseOverEvent();
        }

        return removeEventListerner;
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

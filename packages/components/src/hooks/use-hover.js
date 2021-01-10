import React from 'react';

export const useHover = refSetter => {
    const [value, setValue] = React.useState(false);
    const default_ref = React.useRef(null);
    const ref = refSetter || default_ref;

    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);

    React.useEffect(() => {
        const node = ref.current;
        if (node) {
            node.addEventListener('mouseenter', handleMouseOver);
            node.addEventListener('mouseleave', handleMouseOut);

            return () => {
                node.removeEventListener('mouseenter', handleMouseOver);
                node.removeEventListener('mouseleave', handleMouseOut);
            };
        }
        return undefined;
    }, [ref]);

    return [ref, value];
};

export const useHoverCallback = () => {
    const [value, setValue] = React.useState(false);

    const handleMouseOver = React.useCallback(() => setValue(true), []);
    const handleMouseOut = React.useCallback(() => setValue(false), []);
    const ref = React.useRef();

    const callbackRef = React.useCallback(
        node => {
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

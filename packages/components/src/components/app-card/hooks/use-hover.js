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

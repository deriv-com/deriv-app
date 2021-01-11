import React from 'react';

export const useHover = refSetter => {
    const [value, setValue] = React.useState(false);
    const default_ref = React.useRef(null);
    const ref = refSetter || default_ref;

    const handleMouseEnter = () => setValue(true);
    const handleMouseLeave = () => setValue(false);

    React.useEffect(() => {
        const node = ref.current;
        if (node) {
            node.addEventListener('mouseenter', handleMouseEnter);
            node.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                node.removeEventListener('mouseenter', handleMouseEnter);
                node.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
        return undefined;
    }, [ref]);

    return [ref, value];
};

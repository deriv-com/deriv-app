import React from 'react';

export const useHover = refSetter => {
    const [value, setValue] = React.useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ref = refSetter || React.useRef(null);

    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);

    React.useEffect(() => {
        const node = ref.current;
        if (node) {
            node.addEventListener('mouseover', handleMouseOver);
            node.addEventListener('mouseout', handleMouseOut);

            return () => {
                node.removeEventListener('mouseover', handleMouseOver);
                node.removeEventListener('mouseout', handleMouseOut);
            };
        }
        return null;
    }, [ref]);

    return [ref, value];
};

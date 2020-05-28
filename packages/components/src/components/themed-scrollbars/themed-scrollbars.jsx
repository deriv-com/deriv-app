import classNames from 'classnames';
import React from 'react';

const ThemedScrollbars = ({
    children,
    className,
    height,
    autohide = true,
    is_native,
    has_horizontal,
    onScroll,
    refSetter,
}) => {
    // Hook
    const useHover = () => {
        const [value, setValue] = React.useState(false);

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
        }, [ref.current]);

        return [ref, value];
    };

    const [hoverRef, isHovered] = useHover();

    if (is_native) return children;
    return (
        <div
            ref={hoverRef}
            className={classNames('dc-themed-scrollbars', className, {
                'dc-themed-scrollbars__autohide': autohide,
                'dc-themed-scrollbars__autohide--is-hovered': autohide && isHovered,
            })}
            style={{ maxHeight: height || '100%', overflowY: 'auto', overflowX: has_horizontal ? 'auto' : 'hidden' }}
            onScroll={onScroll}
        >
            {children}
        </div>
    );
};

export default ThemedScrollbars;

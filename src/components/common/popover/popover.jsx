import React from 'react';
import { Popover as TinyPopover } from 'react-tiny-popover';
import PropTypes from 'prop-types';

const Popover = ({ id, class_container, children, content }) => {
    const [is_hovered, updateIsHovered] = React.useState(false);
    return (
        <span
            id={id}
            className={class_container}
            onMouseEnter={() => {
                updateIsHovered(true);
            }}
            onMouseLeave={() => {
                updateIsHovered(false);
            }}
        >
            <TinyPopover
                isOpen={is_hovered}
                positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
                content={
                    <div className='popover__container'>
                        <span>{content}</span>
                    </div>
                }
            >
                {children}
            </TinyPopover>
        </span>
    );
};

Popover.propTypes = {
    id: PropTypes.string,
    class_container: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    content: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default Popover;

import React from 'react';
import PropTypes from 'prop-types';
import './microtip.scss';

const Microtip = ({
    message,
    position = 'top',
    duration = '.18',
    delay = '0',
    fontSize = 'xxs',
    className,
    children,
    pointerEvents = 'none',
    zIndex,
}) => {
    const Styles = {
        delay: { '--microtip-transition-delay': `${delay}s` },
        duration: { '--microtip-transition-duration': `${duration}s` },
        fontSize: { '--microtip-font-size': `var(--text-size-${fontSize})` },
        fontWeight: { '--microtip-font-weight': 'normal' },
        textTransform: { '--microtip-text-transform': 'none' },
        pointerEvents: { '--microtip-pointer-events': `${pointerEvents}` },
    };

    return (
        <data
            aria-label={message}
            data-microtip-position={position}
            data-microtip-size='100% auto !important'
            role='tooltip'
            className={className}
            style={{
                ...Styles.delay,
                ...Styles.duration,
                ...Styles.fontSize,
                ...Styles.fontWeight,
                ...Styles.textTransform,
                zIndex,
            }}
        >
            {children}
        </data>
    );
};

Microtip.propTypes = {
    children: PropTypes.any,
    delay: PropTypes.number,
    duration: PropTypes.number,
    fontSize: PropTypes.oneOf(['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl']),
    message: PropTypes.string,
    pointerEvents: PropTypes.string,
    position: PropTypes.oneOf([
        'bottom',
        'bottom-left',
        'bottom-right',
        'left',
        'right',
        'top',
        'top-left',
        'top-right',
    ]),
    zIndex: PropTypes.number,
};

export default Microtip;

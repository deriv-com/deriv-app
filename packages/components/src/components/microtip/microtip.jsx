import React from 'react';
import PropTypes from 'prop-types';
import './microtip.scss';

const Microtip = ({
    label,
    alignment = 'top',
    duration = '.16',
    delay = '0',
    fontSize = 'xxs',
    fontWeight = 'normal',
    target_className,
    children,
    has_pointer_events = false,
    size = 'small',
    has_arrow = true,
    zIndex,
}) => {
    const Styles = {
        delay: { '--microtip-transition-delay': `${delay}s` },
        duration: { '--microtip-transition-duration': `${duration}s` },
        fontSize: { '--microtip-font-size': `var(--text-size-${fontSize})` },
        fontWeight: { '--microtip-font-weight': fontWeight },
        textTransform: { '--microtip-text-transform': 'none' },
        pointerEvents: { '--microtip-pointer-events': `${has_pointer_events ? 'true' : 'none'}` },
    };

    return (
        <data
            aria-label={label}
            data-microtip-position={alignment}
            data-microtip-size={size}
            data-microtip-has-arrow={has_arrow ? 'true' : 'none'}
            role='tooltip'
            className={target_className}
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
    label: PropTypes.string,
    has_pointer_events: PropTypes.bool,
    alignment: PropTypes.oneOf([
        'bottom',
        'bottom-left',
        'bottom-right',
        'left',
        'right',
        'top',
        'top-left',
        'top-right',
    ]),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    has_arrow: PropTypes.bool,
    zIndex: PropTypes.number,
};

export default React.memo(Microtip);

import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ children, size, color, align, weight, line_height, as, className, ...props }) => {
    const setStyle = () => {
        const style = {
            '--text-size': `var(--text-size-${size || 's'})`,
            '--text-color': `var(--text-${color || 'general'})`,
            '--text-lh': `var(--text-lh-${line_height || 'm'})`,
            '--text-weight': `var(--text-weight-${weight || 'normal'})`,
        };
        return style;
    };

    const text_align = align || 'left';
    const class_names = classNames('dc-text', {
        [`dc-text--${text_align}`]: !!text_align,
        className,
    });
    return (
        (as === 'p' && (
            <p {...props} className={class_names} style={setStyle()}>
                {children}
            </p>
        )) || (
            <span {...props} className={class_names} style={setStyle()}>
                {children}
            </span>
        )
    );
};

Text.propTypes = {
    line_height: PropTypes.string.required,
    size: PropTypes.string.required,
};

export default Text;

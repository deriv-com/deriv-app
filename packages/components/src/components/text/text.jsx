import classNames from 'classnames';
import React from 'react';

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

    const class_names = classNames('dc-text', {
        [`dc-text--${align}`]: !!align,
        className,
    });
    return (
        (as === 'p' && (
            <p {...props} className={class_names} style={setStyle()}>
                {children}
            </p>
        )) || (
            <span {...props} title={props.title} className={class_names} style={setStyle()}>
                {children}
            </span>
        )
    );
};

export default Text;

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
    const setClassName = () => {
        const classStyle = ['dc-text', `${align ? `dc-text--${align}` : ''}`, className];
        return classStyle;
    };
    return (
        (as === 'p' && (
            <p {...props} className={classNames(setClassName())} style={setStyle()}>
                {children}
            </p>
        )) || (
            <span {...props} title={props.title} className={classNames(setClassName())} style={setStyle()}>
                {children}
            </span>
        )
    );
};

export default Text;

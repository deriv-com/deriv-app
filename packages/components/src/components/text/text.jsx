import classNames from 'classnames';
import React from 'react';

const Text = ({ children, size, color, align, weight, lineHeight, as, className }) => {
    function setStyle() {
        const style = {
            '--text-size': size ? `var(--text-size-${size})` : '',
            '--text-color': color ? `var(--text-${color})` : '',
            '--text-lh': lineHeight ? `var(--text-lh-${lineHeight})` : '',
        };
        return style;
    }
    function setClassName() {
        const classStyle = ['dc-text', `dc-text--${weight} dc-text--${align}`, className];
        return classStyle;
    }
    return (
        ({ as } === 'span' && (
            <span className={classNames(setClassName())} style={setStyle()}>
                {children}
            </span>
        )) || (
            <p className={classNames(setClassName())} style={setStyle()}>
                {children}
            </p>
        )
    );
};

export default Text;

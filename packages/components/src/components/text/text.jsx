import classNames from 'classnames';
import React from 'react';

const Text = ({ children, size, color, align, weight, lineHeight, as, className }) => {
    function setStyle() {
        const style = {
            ...(size ? { '--text-size': `var(--text-size-${size})` } : {}),
            ...(color ? { '--text-color': `var(--text-${color})` } : {}),
            ...(lineHeight ? { '--text-lh': `var(--text-lh-${lineHeight})` } : {}),
        };
        return style;
    }
    function setClassName() {
        const classStyle = [
            'dc-text',
            `${weight ? `dc-text--${weight}` : ''} ${align ? `dc-text--${align}` : ''}`,
            className,
        ];
        return classStyle;
    }
    return (
        (as === 'p' && (
            <p className={classNames(setClassName())} style={setStyle()}>
                {children}
            </p>
        )) || (
            <span className={classNames(setClassName())} style={setStyle()}>
                {children}
            </span>
        )
    );
};

export default Text;

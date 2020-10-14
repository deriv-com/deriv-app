import classNames from 'classnames';
import React from 'react';

const Text = ({ children, size, color, align, weight, lineHeight, as, className }) => {
    function setStyle() {
        const style = {
            '--text-size': `var(--text-size-${size || 's'})`,
            '--text-color': `var(--text-${color || 'general'})`,
            '--text-lh': `var(--text-lh-${lineHeight || (as === 'p' ? 'm' : 'xs')})`,
            '--text-weight': `var(--text-weight-${weight || 'n'})`,
        };
        return style;
    }
    function setClassName() {
        const classStyle = ['dc-text', `${align ? `dc-text--${align}` : ''}`, className];
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

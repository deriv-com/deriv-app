import classNames from 'classnames';
import React from 'react';

const Text = ({ children, size, color, align, weight, lineHeight, as, className, ...props }) => {
    function setStyle() {
        const style = {
            '--text-size': `var(--text-size-${props.size || 's'})`,
            '--text-color': `var(--text-${props.color || 'general'})`,
            '--text-lh': `var(--text-lh-${props.line_height || 'm'})`,
            '--text-weight': `var(--text-weight-${props.weight || 'normal'})`,
        };
        return style;
    }
    function setClassName() {
        const classStyle = ['dc-text', `${props.align ? `dc-text--${props.align}` : ''}`, props.className];
        return classStyle;
    }
    return (
        (props.as === 'p' && (
            <p className={classNames(setClassName())} style={setStyle()}>
                {children}
            </p>
        )) || (
            <span title={props.title} className={classNames(setClassName())} style={setStyle()}>
                {children}
            </span>
        )
    );
};

export default Text;

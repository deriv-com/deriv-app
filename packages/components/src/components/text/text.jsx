import classNames from 'classnames';
import React from 'react';

const Text = ({ children, size, color, align, weight, lineHeight, as }) => {
    function setStyle() {
        const style = {
            '--text-size': 'var(--text-size-' + size + ')',
            '--text-color': 'var(--text-' + color + ')',
            '--text-lh': 'var(--text-lh-' + lineHeight + ')',
        };
        return style;
    }
    function setClassName() {
        const classNames = ['dc-text', `dc-text--${weight} dc-text--${align}`];
        return classNames;
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

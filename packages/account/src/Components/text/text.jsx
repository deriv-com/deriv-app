import classNames from 'classnames';
import React from 'react';

export const Text = ({ children, size, color, className }) => (
    <p
        className={classNames('account__text', className, {
            'account__text--xsmall': size === 'xsmall',
            'account__text--small': size === 'small',
            'account__text--grey': color === 'grey',
        })}
    >
        {children}
    </p>
);

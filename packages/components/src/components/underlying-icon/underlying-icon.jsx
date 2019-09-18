import classNames from 'classnames';
import React      from 'react';

const UnderlyingIcon = ({ market }) => (
    <div
        className={classNames(
            'icons-underlying',
            `icons-underlying__ic-${market ? market.toUpperCase() : 'unknown'}`
        )}
    />
);

export default UnderlyingIcon;

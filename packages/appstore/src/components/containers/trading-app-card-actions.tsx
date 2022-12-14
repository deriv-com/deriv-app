import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import { Link } from 'react-router-dom';

export type Actions = {
    type: 'get' | 'none' | 'trade';
    link_to?: string;
};

const TradingAppCardActions = ({ type, link_to }: Actions) => {
    switch (type) {
        case 'get':
            return <Button primary_light>{localize('Get')}</Button>;
        case 'trade':
            return (
                <Link to={link_to}>
                    <Button primary>Trade</Button>
                </Link>
            );
        case 'none':
        default:
            return null;
    }
};

export default TradingAppCardActions;

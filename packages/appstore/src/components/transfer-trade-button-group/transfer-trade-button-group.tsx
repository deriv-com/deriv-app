import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Actions } from 'Components/containers/trading-app-card-actions';
import TradeButton from 'Components/trade-button';
import React from 'react';

const TransferTradeButtonGroup = ({ link_to, onAction }: Pick<Actions, 'link_to' | 'onAction'>) => {
    return (
        <div className='transfer-trade-button-group'>
            <Button secondary>{localize('Transfer')}</Button>
            <TradeButton link_to={link_to} onAction={onAction} />
        </div>
    );
};
export default TransferTradeButtonGroup;

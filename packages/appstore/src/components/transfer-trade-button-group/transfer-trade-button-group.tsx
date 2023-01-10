import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Actions } from 'Components/containers/trading-app-card-actions';
import TradeButton from 'Components/trade-button';
import React from 'react';

const TransferTradeButtonGroup = ({
    link_to,
    onAction,
    is_buttons_disabled,
}: Pick<Actions, 'link_to' | 'onAction' | 'is_buttons_disabled'>) => {
    return (
        <div className='transfer-trade-button-group'>
            <Button secondary name='transfer-btn' onClick={onAction} is_disabled={is_buttons_disabled}>
                {localize('Transfer')}
            </Button>
            <TradeButton link_to={link_to} onAction={onAction} is_buttons_disabled={is_buttons_disabled} />
        </div>
    );
};
export default TransferTradeButtonGroup;

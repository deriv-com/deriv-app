import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import TradeButton from 'Components/trade-button/trade-button';
import TransferTradeButtonGroup from 'Components/transfer-trade-button-group';
import React from 'react';
import { observer } from 'mobx-react-lite';

export type Actions = {
    type: 'get' | 'none' | 'trade' | 'dxtrade' | 'transfer_trade' | 'dxtrade_transfer_trade';
    link_to?: string;
    has_divider?: boolean;
    onAction?: () => void;
};

const TradingAppCardActions = ({ type, link_to, onAction }: Actions) => {
    switch (type) {
        case 'get':
            return (
                <Button primary_light onClick={() => onAction?.()}>
                    {localize('Get')}
                </Button>
            );
        case 'trade':
            return <TradeButton link_to={link_to} onAction={onAction} />;
        case 'dxtrade':
            return <TradeButton link_to={link_to} />;
        case 'transfer_trade':
            return <TransferTradeButtonGroup link_to={link_to} onAction={onAction} />;
        case 'none':
        default:
            return null;
    }
};

export default observer(TradingAppCardActions);

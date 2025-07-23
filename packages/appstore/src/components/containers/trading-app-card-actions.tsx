import React from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';

import MultiActionButtonGroup from 'Components/multi-action-button-group';
import TradeButton from 'Components/trade-button/trade-button';

export type Actions = {
    action_type: 'get' | 'none' | 'trade' | 'dxtrade' | 'multi-action' | 'open'; // multi-action can be tranfer_trade or top_up_trade
    clickable_icon?: boolean;
    link_to?: string;
    has_divider?: boolean;
    onAction?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    is_external?: boolean;
    new_tab?: boolean;
    is_buttons_disabled?: boolean;
    is_account_being_created?: boolean;
    is_real?: boolean;
    is_new?: boolean;
};

const TradingAppCardActions = ({
    action_type,
    link_to,
    onAction,
    is_external,
    new_tab,
    is_account_being_created,
    is_buttons_disabled,
    is_real,
}: Actions) => {
    switch (action_type) {
        case 'get':
            return (
                <Button disabled={is_account_being_created} primary_light onClick={() => onAction?.()}>
                    {localize('Get')}
                </Button>
            );
        case 'trade':
            return <TradeButton link_to={link_to} onAction={onAction} is_external={is_external} new_tab={new_tab} />;
        case 'dxtrade':
            return <TradeButton link_to={link_to} />;
        case 'multi-action':
            return (
                <MultiActionButtonGroup
                    link_to={link_to}
                    onAction={onAction}
                    is_buttons_disabled={is_buttons_disabled}
                    is_real={is_real}
                />
            );
        case 'open':
            return (
                <Button primary onClick={() => onAction?.()}>
                    {localize('Open')}
                </Button>
            );
        case 'none':
        default:
            return null;
    }
};

export default observer(TradingAppCardActions);

import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import TradeButton from 'Components/trade-button/trade-button';
import React from 'react';
import MultiActionButtonGroup from 'Components/multi-action-button-group';

type TonAction = {
    (e?: React.MouseEvent<HTMLButtonElement>): void | VoidFunction;
};

export type Actions = {
    action_type: 'get' | 'none' | 'trade' | 'dxtrade' | 'multi-action'; // multi-action can be tranfer_trade or top_up_trade
    clickable_icon?: boolean;
    link_to?: string;
    has_divider?: boolean;
    onAction?: TonAction;
    is_external?: boolean;
    new_tab?: boolean;
    is_buttons_disabled?: boolean;
    is_account_being_created?: boolean;
    is_real?: boolean;
    as_disabled?: boolean;
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
    as_disabled,
}: Actions) => {
    switch (action_type) {
        case 'get':
            return (
                <Button disabled={is_account_being_created} primary_light onClick={onAction} as_disabled={as_disabled}>
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
                    as_disabled_deposit_button={as_disabled}
                />
            );
        case 'none':
        default:
            return null;
    }
};

export default TradingAppCardActions;

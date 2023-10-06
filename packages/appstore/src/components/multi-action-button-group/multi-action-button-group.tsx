import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useFeatureFlags } from '@deriv/hooks';
import { Actions } from 'Components/containers/trading-app-card-actions';
import TradeButton from 'Components/trade-button';

/**
 * Handles Transfer, Trade and top up. It uses the name attribute of the <button /> element to distinguish between transfer and top up
 * @param { string } link_to // contains the URL for the trade button
 * @param { onAction } // a callback function that handles the current action
 * @param { boolean } // indicates whether the current account type is real or demo
 * @returns {JSX.Element}
 * */
const MultiActionButtonGroup = ({
    link_to,
    onAction,
    is_buttons_disabled,
    is_real,
    as_disabled_deposit_button,
}: Pick<Actions, 'link_to' | 'onAction' | 'is_buttons_disabled' | 'is_real'> & {
    as_disabled_deposit_button?: boolean;
}) => {
    const { is_wallet_enabled } = useFeatureFlags();

    return (
        <div className='multi-action-button-group'>
            <Button
                secondary
                name={`${is_real ? 'transfer-btn' : 'topup-btn'}`}
                onClick={onAction}
                is_disabled={is_buttons_disabled}
                as_disabled={as_disabled_deposit_button}
            >
                {is_real || is_wallet_enabled ? localize('Transfer') : localize('Top up')}
            </Button>
            <TradeButton link_to={link_to} onAction={onAction} is_buttons_disabled={is_buttons_disabled} />
        </div>
    );
};
export default MultiActionButtonGroup;

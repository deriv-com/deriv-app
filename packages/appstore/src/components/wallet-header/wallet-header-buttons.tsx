import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';

type TWalletHeaderButtons = {
    is_disabled?: boolean;
    is_open: boolean;
    account_type: 'demo' | 'real';
};

const WalletHeaderButtons = ({ is_disabled = false, is_open, account_type = 'real' }: TWalletHeaderButtons) => {
    const is_demo = account_type === 'demo';
    const button_text_size = 'xs';

    const btn_names = is_demo
        ? ['Transfer', 'Transactions', 'Deposit']
        : ['Deposit', 'Withdraw', 'Transfer', 'Transactions'];
    const icon_names = is_demo
        ? ['IcAccountTransfer', 'IcStatement', 'IcCashierAdd']
        : ['IcCashierAdd', 'IcCashierMinus', 'IcAccountTransfer', 'IcStatement'];

    return (
        <div className='wallet-header__description-buttons'>
            {btn_names.map((name, index) => (
                <div
                    key={name}
                    className={classNames('wallet-header__description-buttons-item', {
                        'wallet-header__description-buttons-item-disabled': is_disabled,
                    })}
                >
                    <Icon
                        icon={icon_names[index]}
                        custom_color={is_disabled ? 'var(--general-disabled)' : 'var(--text-general)'}
                    />
                    <Localize
                        i18n_default_text={`<0>${is_demo && name === 'Deposit' ? 'Reset balance' : name}</0>`}
                        components={[
                            <Text
                                key={0}
                                weight='bold'
                                color={is_disabled ? 'disabled' : 'general'}
                                size={button_text_size}
                                custom_color
                                className={classNames('wallet-header__description-buttons-item-text', {
                                    'wallet-header__description-buttons-item-active': is_open,
                                })}
                            />,
                        ]}
                    />
                </div>
            ))}
        </div>
    );
};
WalletHeaderButtons.displayName = 'WalletHeaderButtons';
export default WalletHeaderButtons;

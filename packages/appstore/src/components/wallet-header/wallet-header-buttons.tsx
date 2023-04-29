import React from 'react';
import { TAccountCategory } from 'Types';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import classNames from 'classnames';

type TWalletHeaderButtons = {
    is_disabled: boolean;
    is_open: boolean;
    account_type: TAccountCategory;
};

const WalletHeaderButtons = ({ is_disabled, is_open, account_type }: TWalletHeaderButtons) => {
    const is_demo = account_type === 'demo';

    const btn_names = is_demo
        ? [
              { name: 'Transfer', text: localize('Transfer') },
              { name: 'Transactions', text: localize('Transactions') },
              { name: 'Deposit', text: localize('Reset balance') },
          ]
        : [
              { name: 'Deposit', text: localize('Deposit') },
              { name: 'Withdraw', text: localize('Withdraw') },
              { name: 'Transfer', text: localize('Transfer') },
              { name: 'Transactions', text: localize('Transactions') },
          ];
    const icon_names = is_demo
        ? ['IcAccountTransfer', 'IcStatement', 'IcCashierAdd']
        : ['IcCashierAdd', 'IcCashierMinus', 'IcAccountTransfer', 'IcStatement'];

    return (
        <div className='wallet-header__description-buttons'>
            {btn_names.map((btn, index) => (
                <div
                    key={btn.name}
                    className={classNames('wallet-header__description-buttons-item', {
                        'wallet-header__description-buttons-item-disabled': is_disabled,
                    })}
                >
                    <Icon
                        icon={icon_names[index]}
                        custom_color={is_disabled ? 'var(--general-disabled)' : 'var(--text-general)'}
                    />
                    <Text
                        weight='bold'
                        color={is_disabled ? 'disabled' : 'general'}
                        size='xs'
                        className={classNames('wallet-header__description-buttons-item-text', {
                            'wallet-header__description-buttons-item-active': is_open,
                        })}
                    >
                        {btn.text}
                    </Text>
                </div>
            ))}
        </div>
    );
};
WalletHeaderButtons.displayName = 'WalletHeaderButtons';
export default WalletHeaderButtons;

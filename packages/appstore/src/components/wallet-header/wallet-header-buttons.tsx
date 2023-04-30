import React from 'react';
import { TAccountCategory } from 'Types';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import classNames from 'classnames';

type TWalletButton = {
    name: string;
    text: string;
    icon: string;
    action: () => void;
};

type TWalletHeaderButtons = {
    is_disabled: boolean;
    is_open: boolean;
    account_type: TAccountCategory;
};

const WalletHeaderButtons = ({ is_disabled, is_open, account_type }: TWalletHeaderButtons) => {
    const is_demo = account_type === 'demo';

    const btns: TWalletButton[] = is_demo
        ? [
              {
                  name: 'Transfer',
                  text: localize('Transfer'),
                  icon: 'IcAccountTransfer',
                  action: () => {
                      //   console.log('Transfer');
                  },
              },
              {
                  name: 'Transactions',
                  text: localize('Transactions'),
                  icon: 'IcStatement',
                  action: () => {
                      //   console.log('Transactions');
                  },
              },
              {
                  name: 'Deposit',
                  text: localize('Reset balance'),
                  icon: 'IcCashierAdd',
                  action: () => {
                      //   console.log('Reset balance');
                  },
              },
          ]
        : [
              {
                  name: 'Deposit',
                  text: localize('Deposit'),
                  icon: 'IcCashierAdd',
                  action: () => {
                      //   console.log('Deposit');
                  },
              },
              {
                  name: 'Withdraw',
                  text: localize('Withdraw'),
                  icon: 'IcCashierMinus',
                  action: () => {
                      //   console.log('Withdraw');
                  },
              },
              {
                  name: 'Transfer',
                  text: localize('Transfer'),
                  icon: 'IcAccountTransfer',
                  action: () => {
                      //   console.log('Transfer');
                  },
              },
              {
                  name: 'Transactions',
                  text: localize('Transactions'),
                  icon: 'IcStatement',
                  action: () => {
                      //   console.log('Transactions');
                  },
              },
          ];

    return (
        <div className='wallet-header__description-buttons'>
            {btns.map(btn => (
                <div
                    key={btn.name}
                    className={classNames('wallet-header__description-buttons-item', {
                        'wallet-header__description-buttons-item-disabled': is_disabled,
                    })}
                    onClick={btn.action}
                >
                    <Icon
                        icon={btn.icon}
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

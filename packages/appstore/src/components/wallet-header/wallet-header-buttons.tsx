import React from 'react';
import { Icon, Text } from '@deriv/components';
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
    btns: TWalletButton[];
};

const WalletHeaderButtons = ({ is_disabled, is_open, btns }: TWalletHeaderButtons) => {
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

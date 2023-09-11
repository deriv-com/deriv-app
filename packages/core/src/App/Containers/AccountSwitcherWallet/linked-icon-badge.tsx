import React from 'react';
import { AppLinkedWithWalletIcon, WalletIcon } from '@deriv/components';
import WalletBadge from 'App/Components/Layout/Header/wallets/wallet-badge';
import './linked-icon-badge.scss';

type TAppIconProps = {
    app_icon: string;
    gradient_class: string;
    is_virtual: boolean;
    label?: string;
    type: React.ComponentProps<typeof WalletIcon>['type'];
    wallet_icon: string;
};

export const LinkedIconBadge = ({ app_icon, gradient_class, is_virtual, label, type, wallet_icon }: TAppIconProps) => {
    if (!app_icon || !wallet_icon || !gradient_class) {
        return null;
    }

    return (
        <div className='app-icon'>
            <div className='app-icon__top'>
                <WalletBadge is_demo={is_virtual} label={label} />
            </div>
            <AppLinkedWithWalletIcon
                app_icon={app_icon}
                gradient_class={gradient_class}
                type={type}
                wallet_icon={wallet_icon}
                hide_watermark
                size='large'
            />
        </div>
    );
};

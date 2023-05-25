import React from 'react';
import { WalletIcon } from '../wallet-icon';
import './app-linked-with-wallet-icon.scss';

type TAppIconProps = {
    currency: string;
    has_bg?: boolean;
    app_icon: string;
    wallet_icon: string;
    size?: 'small' | 'medium' | 'large';
    type: 'fiat' | 'crypto'; // Type of the wallet_icon
};

/**
 * Use the WalletIcon sizes
 */
const sizes = {
    top: {
        small: 'small',
        medium: 'medium',
        large: 'xlarge',
    },
    bottom: {
        small: 'xsmall',
        medium: 'small',
        large: 'large',
    },
} as const;

const AppIcon = ({ currency, app_icon, wallet_icon, size = 'medium', type }: TAppIconProps) => {
    if (!app_icon || !wallet_icon || !currency) {
        return null;
    }

    return (
        <div className={`app-icon app-icon--${size}`}>
            {/* Top */}
            <div className='app-icon__top-icon'>
                <WalletIcon icon={app_icon} size={sizes.top[size]} type={type} />
            </div>

            {/* Bottom */}
            <div className='app-icon__bottom-icon'>
                <WalletIcon icon={wallet_icon} currency={currency} type={type} size={sizes.bottom[size]} has_bg />
            </div>
        </div>
    );
};

export default AppIcon;

import React from 'react';
import { WalletBaseIcon } from '../WalletBaseIcon';
import './WalletsAppLinkedWithWalletIcon.scss';
import { WalletGradientBackground } from '../WalletGradientBackground';

type TAppIconProps = {
    appIcon: string;
    currency: string;
    size?: 'large' | 'medium' | 'small';
    walletIcon: string;
};

const WalletsAppLinkedWithWalletIcon = ({ appIcon, currency, size = 'medium', walletIcon }: TAppIconProps) => {
    return (
        <div className={`wallets-app-linked-with-wallet-icon wallets-app-linked-with-wallet-icon--${size}`}>
            {/* App Icon */}
            <div className='wallets-app-linked-with-wallet-icon__app-icon'>
                <WalletBaseIcon icon={appIcon} />
            </div>

            {/* Wallet Icon */}
            <div className='wallets-app-linked-with-wallet-icon__wallet-icon'>
                <WalletGradientBackground currency={currency}>
                    <WalletBaseIcon
                        className='wallets-app-linked-with-wallet-icon__wallet-base-icon'
                        icon={walletIcon}
                    />
                </WalletGradientBackground>
            </div>
        </div>
    );
};

export default WalletsAppLinkedWithWalletIcon;

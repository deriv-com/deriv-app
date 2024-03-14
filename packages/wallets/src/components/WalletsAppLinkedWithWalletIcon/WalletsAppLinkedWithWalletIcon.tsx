import React from 'react';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletResponsiveSvg } from '../WalletResponsiveSvg';
import './WalletsAppLinkedWithWalletIcon.scss';

type TAppIconProps = {
    appIcon: string;
    currency: string;
    isDemo?: boolean;
    size?: 'large' | 'medium' | 'small';
    walletIcon: string;
};

const WalletsAppLinkedWithWalletIcon = ({
    appIcon,
    currency,
    isDemo = false,
    size = 'medium',
    walletIcon,
}: TAppIconProps) => {
    return (
        <div
            className={`wallets-app-linked-with-wallet-icon wallets-app-linked-with-wallet-icon--${size}`}
            data-testid='wallets-app-linked-with-wallet-icon'
        >
            {/* Wallet Icon */}
            <div className='wallets-app-linked-with-wallet-icon__wallet-icon'>
                <WalletGradientBackground currency={currency && currency.toUpperCase()} isDemo={isDemo}>
                    <WalletResponsiveSvg
                        className='wallets-app-linked-with-wallet-icon__wallet-base-icon'
                        icon={walletIcon}
                    />
                </WalletGradientBackground>
            </div>

            {/* App Icon */}
            <div className='wallets-app-linked-with-wallet-icon__app-icon'>
                <WalletResponsiveSvg icon={appIcon} />
            </div>
        </div>
    );
};

export default WalletsAppLinkedWithWalletIcon;

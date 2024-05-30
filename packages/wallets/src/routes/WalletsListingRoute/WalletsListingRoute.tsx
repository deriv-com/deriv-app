import React, { useEffect } from 'react';
import { useAuthorize, useBalanceSubscription } from '@deriv/api-v2';
import {
    DesktopWalletsList,
    WalletListHeader,
    WalletsAddMoreCarousel,
    WalletsCarousel,
    WalletTourGuide,
} from '../../components';
import ResetMT5PasswordHandler from '../../features/cfd/ResetMT5PasswordHandler';
import useDevice from '../../hooks/useDevice';
import { TSubscribedBalance } from '../../types';
import './WalletsListingRoute.scss';

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();
    const { subscribe, unsubscribe, ...rest } = useBalanceSubscription();
    const { isSuccess } = useAuthorize();
    useEffect(() => {
        if (!isSuccess) return;
        subscribe({
            account: 'all',
        });
        return () => {
            unsubscribe();
        };
    }, [isSuccess, subscribe, unsubscribe]);

    return (
        <div className='wallets-listing-route'>
            <WalletListHeader />
            {isMobile ? (
                <WalletsCarousel balance={{ ...rest } as unknown as TSubscribedBalance['balance']} />
            ) : (
                <DesktopWalletsList balance={{ ...rest } as unknown as TSubscribedBalance['balance']} />
            )}
            <WalletsAddMoreCarousel />
            <ResetMT5PasswordHandler />
            <WalletTourGuide />
        </div>
    );
};

export default WalletsListingRoute;

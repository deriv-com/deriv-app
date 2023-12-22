import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount, useAuthorize, useWalletAccountsList } from '@deriv/api';
import {
    DesktopWalletsList,
    WalletsAddMoreCarousel,
    WalletsCarousel,
    WalletsResetMT5Password,
    WalletTourGuide,
} from '../../components';
import { useModal } from '../../components/ModalProvider';
import { CFD_PLATFORMS } from '../../features/cfd/constants';
import { getActionFromUrl } from '../../helpers/urls';
import useDevice from '../../hooks/useDevice';
import { TPlatforms } from '../../types';
import './WalletsListingRoute.scss';

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();
    const { data: walletAccounts } = useWalletAccountsList();
    const { switchAccount } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const { show } = useModal();

    const [password, setPassword] = useState('');
    const resetTradingPlatformActionParams = getActionFromUrl();

    const firstLoginid = walletAccounts?.[0]?.loginid;

    const platformMapping: Record<string, Exclude<TPlatforms.All, 'ctrader'>> = {
        trading_platform_dxtrade_password_reset: CFD_PLATFORMS.DXTRADE,
        trading_platform_mt5_password_reset: CFD_PLATFORMS.MT5,
    };

    useEffect(() => {
        const platformKey = resetTradingPlatformActionParams ? platformMapping[resetTradingPlatformActionParams] : null;
        if (platformKey) {
            const verificationCode = localStorage.getItem(
                `verification_code.trading_platform_${platformKey}_password_reset`
            );

            if (verificationCode) {
                show(
                    <WalletsResetMT5Password
                        onChange={e => setPassword(e.target.value)}
                        password={password}
                        platform={platformKey}
                        verificationCode={verificationCode}
                    />
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password]);

    useEffect(() => {
        if (!activeWallet && firstLoginid) {
            switchAccount(firstLoginid);
        }
    }, [activeWallet, firstLoginid, switchAccount]);

    return (
        <div className='wallets-listing-route'>
            {isMobile ? <WalletsCarousel /> : <DesktopWalletsList />}
            <WalletsAddMoreCarousel />
            {!isMobile && <WalletTourGuide />}
        </div>
    );
};

export default WalletsListingRoute;

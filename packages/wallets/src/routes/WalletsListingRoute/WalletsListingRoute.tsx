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
import { getActionFromUrl } from '../../helpers/urls';
import useDevice from '../../hooks/useDevice';
import { platformMapping } from '../../utils/cfdUtils';
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

    useEffect(() => {
        let platformKey;
        if (resetTradingPlatformActionParams !== null) {
            platformKey = platformMapping[resetTradingPlatformActionParams];
        }
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

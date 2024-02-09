import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig } from '@deriv/api';
import { Loader } from '../../../../components';
import { WithdrawalCryptoModule, WithdrawalFiatModule, WithdrawalVerificationModule } from '../../modules';

const WalletWithdrawal = () => {
    const { getConfig, isSuccess: isCurrencyConfigSuccess } = useCurrencyConfig();
    const { switchAccount } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const loginidQueryParam = queryParams.get('loginid');
        const verificationQueryParam = queryParams.get('verification');

        // if loginid query param doesn't match active wallet's loginid on mount, initiate account switching
        if (loginidQueryParam && loginidQueryParam !== activeWallet?.loginid) {
            switchAccount(loginidQueryParam);
            return;
        }

        // given that loginid query param matches active wallet's loginid on mount, clear query params and proceed
        if (loginidQueryParam && verificationQueryParam) {
            setVerificationCode(verificationQueryParam);

            const url = new URL(window.location.href);
            url.searchParams.delete('loginid');
            url.searchParams.delete('verification');
            window.history.replaceState({}, document.title, url.toString());
        }
    }, [activeWallet?.loginid, switchAccount]);

    if (verificationCode) {
        if (isCurrencyConfigSuccess && activeWallet?.currency) {
            if (getConfig(activeWallet?.currency)?.is_fiat) {
                return <WithdrawalFiatModule verificationCode={verificationCode} />;
            }
            return (
                <WithdrawalCryptoModule
                    onClose={() => {
                        setVerificationCode('');
                    }}
                    verificationCode={verificationCode}
                />
            );
        }
        return <Loader />;
    }
    return <WithdrawalVerificationModule />;
};

export default WalletWithdrawal;

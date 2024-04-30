import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import { WithdrawalCryptoModule, WithdrawalFiatModule, WithdrawalVerificationModule } from '../../modules';
import { WithdrawalNoBalance } from '../../screens';

const WalletWithdrawal = () => {
    const { isSuccess: isCurrencyConfigSuccess } = useCurrencyConfig();
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
        if (verificationQueryParam) {
            setVerificationCode(verificationQueryParam);

            const url = new URL(window.location.href);
            url.searchParams.delete('loginid');
            url.searchParams.delete('verification');
            window.history.replaceState({}, document.title, url.toString());
        }
    }, [activeWallet?.loginid, switchAccount]);

    const isCrypto = activeWallet?.currency_config?.is_crypto;

    if (!activeWallet) return <Loader />;

    if (isCurrencyConfigSuccess && activeWallet?.currency && verificationCode) {
        return isCrypto ? (
            <WithdrawalCryptoModule
                onClose={() => {
                    setVerificationCode('');
                }}
                verificationCode={verificationCode}
            />
        ) : (
            <WithdrawalFiatModule verificationCode={verificationCode} />
        );
    }

    return (
        <WithdrawalNoBalance activeWallet={activeWallet}>
            <WithdrawalVerificationModule />
        </WithdrawalNoBalance>
    );
};

export default WalletWithdrawal;

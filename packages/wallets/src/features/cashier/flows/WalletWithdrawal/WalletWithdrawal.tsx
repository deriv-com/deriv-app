import React, { useEffect, useState } from 'react';
import { useAuthorize, useCurrencyConfig } from '@deriv/api';
import { WithdrawalCryptoModule, WithdrawalFiatModule, WithdrawalVerificationModule } from '../../modules';
import { Loader } from '../../../../components/Loader';

const WalletWithdrawal = () => {
    const {
        data: authorizeData,
        isLoading: isAuthorizeLoading,
        isSuccess: isAuthorizeSuccess,
        switchAccount,
    } = useAuthorize();
    const { getConfig, isLoading: isCurrencyConfigLoading, isSuccess: isCurrencyConfigSuccess } = useCurrencyConfig();
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const verificationQueryParam = queryParams.get('verification');
        const walletIdParam = queryParams.get('walletid');

        if (verificationQueryParam && walletIdParam) {
            setVerificationCode(verificationQueryParam);
            switchAccount(walletIdParam); // authorize the intended wallet

            const url = new URL(window.location.href);
            url.searchParams.delete('verification'); // Remove the 'verification_code' query parameter
            url.searchParams.delete('walletid'); // Remove the 'loginid' of the wallet from the query parameters
            window.history.replaceState({}, document.title, url.toString());
        }
    }, []);

    return (
        <>
            {(isAuthorizeLoading || isCurrencyConfigLoading) && <Loader />}
            {verificationCode && isAuthorizeSuccess && isCurrencyConfigSuccess && authorizeData.currency ? (
                getConfig(authorizeData.currency)?.type === 'fiat' ? (
                    <WithdrawalFiatModule verificationCode={verificationCode} />
                ) : (
                    <WithdrawalCryptoModule verificationCode={verificationCode} />
                )
            ) : (
                <WithdrawalVerificationModule />
            )}
        </>
    );
};

export default WalletWithdrawal;

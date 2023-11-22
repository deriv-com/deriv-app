import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount, useCurrencyConfig } from '@deriv/api';
import { WithdrawalCryptoModule, WithdrawalFiatModule, WithdrawalVerificationModule } from '../../modules';
import { Loader } from '../../../../components';

const WalletWithdrawal = () => {
    const { getConfig, isSuccess: isCurrencyConfigSuccess } = useCurrencyConfig();
    const { data: activeWallet } = useActiveWalletAccount();
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const verificationQueryParam = queryParams.get('verification');

        if (verificationQueryParam) {
            setVerificationCode(verificationQueryParam);

            const url = new URL(window.location.href);
            url.searchParams.delete('verification'); // Remove the 'verification_code' query parameter
            window.history.replaceState({}, document.title, url.toString());
        }
    }, []);

    if (verificationCode) {
        if (isCurrencyConfigSuccess && activeWallet?.currency) {
            if (getConfig(activeWallet?.currency)?.is_fiat) {
                return <WithdrawalFiatModule verificationCode={verificationCode} />;
            }
            return <WithdrawalCryptoModule verificationCode={verificationCode} />;
        }
        return <Loader />;
    }
    return <WithdrawalVerificationModule />;
};

export default WalletWithdrawal;

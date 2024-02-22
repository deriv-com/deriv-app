import React, { useEffect, useState } from 'react';
import { useActiveAccount, useCurrencyConfig } from '@deriv/api';
import { Loader } from '@deriv-com/ui';
import { WithdrawalFiatModule, WithdrawalVerificationModule } from '../../lib';

const WalletWithdrawal = () => {
    const { getConfig, isSuccess: isCurrencyConfigSuccess } = useCurrencyConfig();
    const { data: activeAccount } = useActiveAccount();
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
        if (isCurrencyConfigSuccess && activeAccount?.currency) {
            if (getConfig(activeAccount?.currency)?.is_fiat) {
                return <WithdrawalFiatModule verificationCode={verificationCode} />;
            }
            return (
                // <WithdrawalCryptoModule
                //     onClose={() => {
                //         setVerificationCode('');
                //     }}
                //     verificationCode={verificationCode}
                // />
                <div>WithdrawalCryptoModule</div>
            );
        }
        return <Loader />;
    }
    return <WithdrawalVerificationModule />;
};

export default WalletWithdrawal;

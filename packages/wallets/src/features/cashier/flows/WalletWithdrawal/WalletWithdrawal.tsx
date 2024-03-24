import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount, useCurrencyConfig } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import {
    CashierLocked,
    WithdrawalCryptoModule,
    WithdrawalFiatModule,
    WithdrawalLocked,
    WithdrawalVerificationModule,
} from '../../modules';

const WalletWithdrawal = () => {
    const { isSuccess: isCurrencyConfigSuccess } = useCurrencyConfig();
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

    const isCrypto = activeWallet?.currency_config?.is_crypto;

    if (verificationCode) {
        if (isCurrencyConfigSuccess && activeWallet?.currency) {
            return (
                <CashierLocked module='withdrawal'>
                    <WithdrawalLocked>
                        {isCrypto ? (
                            <WithdrawalCryptoModule
                                onClose={() => {
                                    setVerificationCode('');
                                }}
                                verificationCode={verificationCode}
                            />
                        ) : (
                            <WithdrawalFiatModule verificationCode={verificationCode} />
                        )}
                    </WithdrawalLocked>
                </CashierLocked>
            );
        }
        return <Loader />;
    }

    return (
        <CashierLocked module='withdrawal'>
            <WithdrawalLocked>
                <WithdrawalVerificationModule />
            </WithdrawalLocked>
        </CashierLocked>
    );
};

export default WalletWithdrawal;

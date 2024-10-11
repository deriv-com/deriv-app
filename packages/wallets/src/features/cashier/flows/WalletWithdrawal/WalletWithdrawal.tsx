import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount, useAuthorize } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import useAllBalanceSubscription from '../../../../hooks/useAllBalanceSubscription';
import { WithdrawalCryptoModule, WithdrawalFiatModule, WithdrawalVerificationModule } from '../../modules';
import { WithdrawalNoBalance } from '../../screens';

const WalletWithdrawal = () => {
    const { switchAccount } = useAuthorize();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: balanceData, isLoading: isBalanceLoading } = useAllBalanceSubscription();
    const [verificationCode, setVerificationCode] = useState('');
    const [resendEmail, setResendEmail] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const loginidQueryParam = queryParams.get('loginid');
        const verificationQueryParam = queryParams.get('verification');
        const localVerificationCode = localStorage.getItem('verification_code.payment_withdraw');

        // if loginid query param doesn't match active wallet's loginid on mount, initiate account switching
        if (loginidQueryParam && loginidQueryParam !== activeWallet?.loginid) {
            switchAccount(loginidQueryParam);
            return;
        }

        // for third party redirections where verification code is fetched from local storage value saved in client store
        if (localVerificationCode) {
            setVerificationCode(localVerificationCode);
            localStorage.removeItem('verification_code.payment_withdraw');
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

    if (!activeWallet || isBalanceLoading) {
        return <Loader />;
    }

    if (balanceData && !isBalanceLoading && balanceData[activeWallet?.loginid ?? 'USD'].balance <= 0) {
        return <WithdrawalNoBalance activeWallet={activeWallet} />;
    }

    if (activeWallet?.currency_config && verificationCode && !isBalanceLoading) {
        const isCryptoProvider = activeWallet.currency_config.platform.cashier.includes('crypto');

        return isCryptoProvider ? (
            <WithdrawalCryptoModule
                setResendEmail={setResendEmail}
                setVerificationCode={setVerificationCode}
                verificationCode={verificationCode}
            />
        ) : (
            <WithdrawalFiatModule
                setResendEmail={setResendEmail}
                setVerificationCode={setVerificationCode}
                verificationCode={verificationCode}
            />
        );
    }

    return <WithdrawalVerificationModule resendEmail={resendEmail} />;
};

export default WalletWithdrawal;

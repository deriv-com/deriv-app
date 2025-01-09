import React, { ButtonHTMLAttributes, useEffect, useState } from 'react';
import { useCashierFiatAddress } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { WalletLoader } from '../../../../components';
import { isServerError } from '../../../../utils/utils';
import { WithdrawalErrorScreen } from '../../screens';
import './WithdrawalFiat.scss';

interface WithdrawalFiatProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    setResendEmail: React.Dispatch<React.SetStateAction<boolean>>;
    setVerificationCode: React.Dispatch<React.SetStateAction<string>>;
    verificationCode?: string;
}

const WithdrawalFiat: React.FC<WithdrawalFiatProps> = ({ setResendEmail, setVerificationCode, verificationCode }) => {
    const { data: iframeUrl, isLoading: isWithdrawalFiatLoading, mutateAsync } = useCashierFiatAddress();
    const [isIframeLoading, setIsIframeLoading] = useState(true);
    const [error, setError] = useState<TSocketError<'cashier'>['error'] | undefined>();

    useEffect(() => {
        if (verificationCode) {
            mutateAsync('withdraw', {
                verification_code: verificationCode,
            }).catch((response: TSocketError<'cashier'> | null) => {
                if (isServerError(response?.error)) setError(response?.error);
            });
        }
    }, [mutateAsync, verificationCode]);

    const resetError = () => {
        setVerificationCode('');
        setError(undefined);
    };

    if (isWithdrawalFiatLoading) return <WalletLoader />;

    if (error) {
        return <WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />;
    }

    return (
        <React.Fragment>
            {isIframeLoading && <WalletLoader />}
            {iframeUrl && (
                <iframe
                    className='wallets-withdrawal-fiat__iframe'
                    data-testid='dt_wallets_withdrawal_fiat_iframe'
                    key={iframeUrl}
                    onLoad={() => setIsIframeLoading(false)}
                    src={iframeUrl}
                    style={{ display: isIframeLoading ? 'none' : 'block' }}
                />
            )}
        </React.Fragment>
    );
};

export default WithdrawalFiat;

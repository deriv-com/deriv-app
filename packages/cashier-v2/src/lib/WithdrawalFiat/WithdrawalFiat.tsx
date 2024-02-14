import React, { ButtonHTMLAttributes, useEffect } from 'react';
import { useCashierFiatAddress } from '@deriv/api';
import { Loader } from '@deriv-com/ui';
import { ErrorScreen } from '../../components/ErrorScreen';
import { isServerError } from '../../utils/utils';
import './WithdrawalFiat.scss';

interface WithdrawalFiatProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    verificationCode?: string;
}

const WithdrawalFiat: React.FC<WithdrawalFiatProps> = ({ verificationCode }) => {
    const { data: iframeUrl, error: withdrawalFiatError, isError, isLoading, mutate } = useCashierFiatAddress();

    useEffect(() => {
        if (verificationCode) {
            mutate('withdraw', {
                verification_code: verificationCode,
            });
        }
    }, [mutate, verificationCode]);

    if (isError && isServerError(withdrawalFiatError.error)) {
        return <ErrorScreen message={withdrawalFiatError.error.message} />;
    }

    return (
        <React.Fragment>
            {isLoading && <Loader />}
            {iframeUrl && (
                <iframe
                    className='wallets-withdrawal-fiat__iframe'
                    data-testid='dt_wallets_withdrawal_fiat_iframe'
                    key={iframeUrl}
                    src={iframeUrl}
                    style={{ display: isLoading ? 'none' : 'block' }}
                />
            )}
        </React.Fragment>
    );
};

export default WithdrawalFiat;

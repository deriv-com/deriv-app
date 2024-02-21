import React, { ButtonHTMLAttributes, useEffect } from 'react';
import { useCashierFiatAddress } from '@deriv/api-v2';
import { Loader, WalletsErrorScreen } from '../../../../components';
import { isServerError } from '../../../../utils/utils';
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
        return <WalletsErrorScreen message={withdrawalFiatError.error.message} />;
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

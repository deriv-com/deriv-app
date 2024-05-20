import React, { ButtonHTMLAttributes, useEffect } from 'react';
import { useCashierFiatAddress } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { Loader } from '../../../../components';
import './WithdrawalFiat.scss';

interface WithdrawalFiatProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    setError: React.Dispatch<
        React.SetStateAction<
            | {
                  code: string;
                  message: string;
              }
            | undefined
        >
    >;
    verificationCode?: string;
}

const WithdrawalFiat: React.FC<WithdrawalFiatProps> = ({ setError, verificationCode }) => {
    const { data: iframeUrl, isLoading, mutateAsync } = useCashierFiatAddress();

    useEffect(() => {
        if (verificationCode) {
            mutateAsync('withdraw', {
                verification_code: verificationCode,
            }).catch((error: TSocketError<'cashier'>) => {
                setError(error.error);
            });
        }
    }, [mutateAsync, setError, verificationCode]);

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

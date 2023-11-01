import React, { useEffect } from 'react';
import { useCashierFiatAddress } from '@deriv/api';
import { Loader } from '../../../../components';
import { WithdrawalVerificationModule } from '../WithdrawalVerification';
import './WithdrawalFiat.scss';

const WithdrawalFiat = () => {
    const verificationCode = sessionStorage.getItem('verification_code');
    const { data: iframeUrl, isLoading, mutate } = useCashierFiatAddress();

    useEffect(() => {
        if (iframeUrl) sessionStorage.removeItem('verification_code');
    }, [iframeUrl, isLoading]);

    useEffect(() => {
        if (verificationCode)
            mutate('withdraw', {
                verification_code: verificationCode,
            });
    }, [mutate]);

    if (verificationCode || iframeUrl) {
        return (
            <React.Fragment>
                {isLoading && <Loader />}
                {iframeUrl && (
                    <iframe
                        className='wallets-withdrawal-fiat__iframe'
                        key={iframeUrl}
                        src={iframeUrl}
                        style={{ display: isLoading ? 'none' : 'block' }}
                    />
                )}
            </React.Fragment>
        );
    }
    return <WithdrawalVerificationModule />;
};

export default WithdrawalFiat;

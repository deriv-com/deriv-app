import React, { useEffect } from 'react';
import { useCashierFiatAddress } from '@deriv/api';
import { Loader, WalletsErrorScreen } from '../../../../components';
import { isServerError } from '../../../../utils/utils';

import './WithdrawalFiat.scss';

const WithdrawalFiat = () => {
    const verificationCode = sessionStorage.getItem('verification_code');
    const { data: iframeUrl, error: withdrawalFiatError, isError, isLoading, mutate } = useCashierFiatAddress();

    useEffect(() => {
        return () => sessionStorage.removeItem('verification_code');
    }, []);

    useEffect(() => {
        if (iframeUrl) sessionStorage.removeItem('verification_code');
    }, [iframeUrl, isLoading]);

    useEffect(() => {
        if (verificationCode)
            mutate('withdraw', {
                verification_code: verificationCode,
            });
    }, [mutate, verificationCode]);

    if (isError && isServerError(withdrawalFiatError.error)) {
        sessionStorage.removeItem('verification_code');
        return <WalletsErrorScreen message={withdrawalFiatError.error.message} />;
    }

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
    // return null;
};

export default WithdrawalFiat;

import React, { useEffect } from 'react';
import { useCashierFiatAddress } from '@deriv/api';
import { Loader, WalletsErrorScreen } from '../../../../components';
import { isServerError } from '../../../../utils/utils';
import { useLocation, useHistory } from 'react-router-dom';

import './WithdrawalFiat.scss';

const WithdrawalFiat = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const verificationCode = queryParams.get('verification');
    const history = useHistory();

    const { data: iframeUrl, error: withdrawalFiatError, isError, isLoading, mutate } = useCashierFiatAddress();

    useEffect(() => {
        if (verificationCode) {
            mutate('withdraw', {
                verification_code: verificationCode,
            });

            queryParams.delete('verification');
            history.replace({
                pathname: location.pathname,
                search: queryParams.toString(), // Updates the URL without the 'verification_code'
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
                    key={iframeUrl}
                    src={iframeUrl}
                    style={{ display: isLoading ? 'none' : 'block' }}
                />
            )}
        </React.Fragment>
    );
};

export default WithdrawalFiat;

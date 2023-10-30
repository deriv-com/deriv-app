import React, { useEffect, useState } from 'react';
import { useAuthorize, useWithdrawalFiatAddress } from '@deriv/api';
import { WalletsErrorScreen } from '../../../../components';
import { isServerError } from '../../../../utils/utils';
import './WithdrawalFiat.scss';

const WithdrawalFiat = () => {
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data: iframeUrl, error: depositError, isError, mutate } = useWithdrawalFiatAddress();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    }, [iframeUrl]);

    useEffect(() => {
        if (isAuthorizeSuccess) {
            // mutate();
        }
    }, [isAuthorizeSuccess, mutate]);

    if (isError && isServerError(depositError.error))
        return <WalletsErrorScreen message={depositError.error.message} />;

    return (
        <React.Fragment>
            {isLoading && <p>Loading...</p>}
            {iframeUrl && (
                <iframe
                    className='wallets-withdrawal-fiat__iframe'
                    key={iframeUrl}
                    onLoad={() => setIsLoading(false)}
                    src={iframeUrl}
                    style={{ display: isLoading ? 'none' : 'block' }}
                />
            )}
        </React.Fragment>
    );
};

export default WithdrawalFiat;

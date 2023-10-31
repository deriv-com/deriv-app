import React, { useEffect, useState } from 'react';
import { useAuthorize, useDepositFiatAddress } from '@deriv/api';
import { Loader, WalletsErrorScreen } from '../../../../components';
import { isServerError } from '../../../../utils/utils';
import './DepositFiat.scss';

const DepositFiat = () => {
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data: iframeUrl, error: depositError, isError, mutate } = useDepositFiatAddress();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    }, [iframeUrl]);

    useEffect(() => {
        if (isAuthorizeSuccess) {
            mutate();
        }
    }, [isAuthorizeSuccess, mutate]);

    if (isError && isServerError(depositError.error))
        return <WalletsErrorScreen message={depositError.error.message} />;

    return (
        <React.Fragment>
            {isLoading && <Loader />}
            {iframeUrl && (
                <iframe
                    className='wallets-deposit-fiat__iframe'
                    key={iframeUrl}
                    onLoad={() => setIsLoading(false)}
                    src={iframeUrl}
                    style={{ display: isLoading ? 'none' : 'block' }}
                />
            )}
        </React.Fragment>
    );
};

export default DepositFiat;

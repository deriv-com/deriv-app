import React, { useEffect, useState } from 'react';
import { useAuthorize, useDepositFiatAddress } from '@deriv/api';
import { WalletsErrorScreen } from '../../../../components';
import './DepositFiat.scss';

const DepositFiat = () => {
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data: iframeUrl, error, isError, mutate } = useDepositFiatAddress();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    }, [iframeUrl]);

    useEffect(() => {
        if (isAuthorizeSuccess) {
            mutate();
        }
    }, [isAuthorizeSuccess, mutate]);

    if (isError) return <WalletsErrorScreen message={(error as Error).message} />;

    return (
        <React.Fragment>
            {isLoading && <p>Loading...</p>}
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

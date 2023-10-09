import React, { useEffect, useState } from 'react';
import { useAuthorize, useDepositFiatAddress } from '@deriv/api';
import './WalletDepositFiat.scss';

const WalletDepositFiat = () => {
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data: iframeUrl, isError, mutate } = useDepositFiatAddress();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    }, [iframeUrl]);

    useEffect(() => {
        if (isAuthorizeSuccess) {
            mutate();
        }
    }, [isAuthorizeSuccess, mutate]);

    if (isError) return <p>Error</p>;

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

export default WalletDepositFiat;

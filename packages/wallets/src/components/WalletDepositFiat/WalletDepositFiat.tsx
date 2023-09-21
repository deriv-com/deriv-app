import React, { useEffect, useState } from 'react';
import { useAuthorize, useDepositFiatAddress } from '@deriv/api';
import './WalletDepositFiat.scss';

const WalletDepositFiat = () => {
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data: iframe_url, isError, mutate } = useDepositFiatAddress();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    }, [iframe_url]);

    useEffect(() => {
        if (isAuthorizeSuccess) {
            mutate();
        }
    }, [isAuthorizeSuccess, mutate]);

    if (isError) return <p>Error</p>;

    return (
        <React.Fragment>
            {isLoading && <p>Loading...</p>}
            {iframe_url && (
                <iframe
                    className='wallets-deposit-fiat__iframe'
                    key={iframe_url}
                    onLoad={() => setIsLoading(false)}
                    src={iframe_url}
                    style={{ display: isLoading ? 'none' : 'block' }}
                />
            )}
        </React.Fragment>
    );
};

export default WalletDepositFiat;

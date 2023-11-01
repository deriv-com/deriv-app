import React, { useEffect, useState } from 'react';
import { useWithdrawalFiatAddress } from '@deriv/api';
import { Loader } from '../../../../components';
import { WithdrawalVerificationModule } from '../WithdrawalVerification';
import './WithdrawalFiat.scss';

const WithdrawalFiat = () => {
    const verification_code = sessionStorage.getItem('verification_code');
    const { data: iframeUrl, mutate } = useWithdrawalFiatAddress(verification_code!);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    }, [iframeUrl]);

    useEffect(() => {
        mutate();
    }, [mutate]);

    if (verification_code || iframeUrl) {
        return (
            <React.Fragment>
                {isLoading && <Loader />}
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
    }
    return <WithdrawalVerificationModule />;
};

export default WithdrawalFiat;

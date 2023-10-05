import React, { useState, useEffect } from 'react';
import { Loading } from '@deriv/components';
import { useWithdrawalFiatAddress } from '@deriv/hooks';
import { ErrorState } from '../../../../components/error-state';

const WithdrawalFiatIframe = () => {
    const { data: iframe_url, error } = useWithdrawalFiatAddress();
    const [is_loading, setIsLoading] = useState(true);

    // To show loading state when switching theme
    useEffect(() => {
        setIsLoading(true);
    }, [iframe_url]);

    if (error) return <ErrorState error={error} />;

    return (
        <React.Fragment>
            {is_loading && <Loading is_fullscreen={false} />}
            {iframe_url && (
                <iframe
                    key={iframe_url}
                    className='withdrawal-fiat-iframe__iframe'
                    onLoad={() => setIsLoading(false)}
                    src={iframe_url}
                    style={{ display: is_loading ? 'none' : 'block' }}
                    data-testid='dt_deposit_fiat_iframe_iframe'
                />
            )}
        </React.Fragment>
    );
};

export default WithdrawalFiatIframe;

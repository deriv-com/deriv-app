import React, { useEffect, useState } from 'react';
import { Loading } from '@deriv/components';
import { useDepositFiatAddress } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { setPerformanceValue } from '@deriv/shared';
import { ErrorState } from '../../../../components/error-state';
import './deposit-fiat-iframe.scss';

const DepositFiatIframe: React.FC = observer(() => {
    const { data: iframe_url, error } = useDepositFiatAddress();
    const [is_loading, setIsLoading] = useState(true);

    // To show loading state when switching theme
    useEffect(() => {
        setIsLoading(true);
    }, [iframe_url]);

    if (!is_loading) setPerformanceValue('load_fiat_deposit_cashier_time');

    if (error) return <ErrorState error={error} />;

    return (
        <React.Fragment>
            {is_loading && <Loading is_fullscreen={false} />}
            {iframe_url && (
                <iframe
                    key={iframe_url}
                    className='deposit-fiat-iframe__iframe'
                    onLoad={() => setIsLoading(false)}
                    src={iframe_url}
                    style={{ display: is_loading ? 'none' : 'block' }}
                    data-testid='dt_deposit_fiat_iframe_iframe'
                />
            )}
        </React.Fragment>
    );
});

export default DepositFiatIframe;

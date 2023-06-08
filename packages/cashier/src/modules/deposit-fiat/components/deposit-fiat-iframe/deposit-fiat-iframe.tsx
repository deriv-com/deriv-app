import React, { useState } from 'react';
import { Loading } from '@deriv/components';
import { useDepositFiatAddress } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import './deposit-fiat-iframe.scss';

const DepositFiatIframe: React.FC = observer(() => {
    const { data: iframe_url, isSuccess } = useDepositFiatAddress();
    const [is_loading, setIsLoading] = useState(true);

    React.useEffect(() => {
        setIsLoading(true);
    }, [iframe_url]);

    return (
        <React.Fragment>
            {is_loading && <Loading className='deposit-fiat-iframe__loader' is_fullscreen={false} />}
            {isSuccess && (
                <iframe
                    className='deposit-fiat-iframe__iframe'
                    onLoad={() => setIsLoading(false)}
                    src={iframe_url}
                    style={!is_loading ? { display: 'block' } : { display: 'none' }}
                    data-testid='dt_deposit_fiat_iframe_iframe'
                />
            )}
        </React.Fragment>
    );
});

export default DepositFiatIframe;

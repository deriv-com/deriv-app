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
            {is_loading && <Loading is_fullscreen={false} />}
            {isSuccess && (
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

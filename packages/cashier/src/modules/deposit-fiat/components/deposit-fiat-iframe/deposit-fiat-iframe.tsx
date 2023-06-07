import React, { useState } from 'react';
import { Loading } from '@deriv/components';
import { useDepositFiatAddress } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import './deposit-fiat-iframe.scss';

const DepositFiatIframe: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const { data: iframe_url, isSuccess, resend } = useDepositFiatAddress();
    const [show_loader, setShowLoader] = useState(true);

    React.useEffect(() => {
        resend();
        setShowLoader(true);
    }, [is_dark_mode_on]);

    return (
        <React.Fragment>
            {show_loader && (
                <Loading
                    className='deposit-fiat-iframe__loader'
                    data-testid='dt_deposit_fiat_iframe_loader'
                    is_fullscreen={false}
                />
            )}
            {isSuccess && (
                <iframe
                    className='deposit-fiat-iframe__iframe'
                    onLoad={() => setShowLoader(false)}
                    src={`${iframe_url}&DarkMode=${is_dark_mode_on ? 'on' : 'off'}`}
                    style={!show_loader ? { display: 'block' } : { display: 'none' }}
                    data-testid='dt_deposit_fiat_iframe_iframe'
                />
            )}
        </React.Fragment>
    );
});

export default DepositFiatIframe;

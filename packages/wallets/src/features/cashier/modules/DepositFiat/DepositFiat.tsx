import React, { useState } from 'react';
import { useCashierFiatAddress } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import './DepositFiat.scss';

const DepositFiat = () => {
    const { data: iframeUrl } = useCashierFiatAddress();
    const [isLoading, setIsLoading] = useState(true);

    return (
        <React.Fragment>
            {isLoading && <Loader />}
            {iframeUrl && (
                <iframe
                    className='wallets-deposit-fiat__iframe'
                    data-testid='dt_deposit-fiat-iframe'
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

import React, { useState } from 'react';
import { Loader } from '../../../../components';
import './DepositFiat.scss';

type TProps = {
    iframeUrl?: string;
};

const DepositFiat: React.FC<TProps> = ({ iframeUrl }) => {
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

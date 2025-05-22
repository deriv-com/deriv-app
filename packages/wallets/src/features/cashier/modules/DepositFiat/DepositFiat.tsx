import React, { useEffect, useState } from 'react';
import { useCashierFiatDepositAddress } from '@deriv/api-v2';
import { WalletLoader } from '../../../../components';
import { isServerError } from '../../../../utils/utils';
import { DepositErrorScreen } from '../../screens';
import './DepositFiat.scss';

const DepositFiat: React.FC = () => {
    const { data: iframeUrl, error, isAuthorizing, isLoading } = useCashierFiatDepositAddress();
    const [isIframeLoading, setIsIframeLoading] = useState(true);
    const depositFiatError = error?.error;

    useEffect(() => {
        if (isAuthorizing) {
            setIsIframeLoading(true);
        }
    }, [isAuthorizing]);

    if (isLoading || isAuthorizing) return <WalletLoader />;

    if (isServerError(depositFiatError)) {
        return <DepositErrorScreen error={depositFiatError} />;
    }

    return (
        <React.Fragment>
            {isIframeLoading && <WalletLoader />}
            {iframeUrl && (
                <iframe
                    className='wallets-deposit-fiat__iframe'
                    data-testid='dt_deposit-fiat-iframe'
                    key={iframeUrl}
                    onLoad={() => setIsIframeLoading(false)}
                    src={iframeUrl}
                    style={{ display: isIframeLoading ? 'none' : 'block' }}
                />
            )}
        </React.Fragment>
    );
};

export default DepositFiat;

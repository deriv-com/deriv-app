import React, { useEffect, useState } from 'react';
import { useAuthorize, useCashierFiatAddress } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import { isServerError } from '../../../../utils/utils';
import { DepositErrorScreen } from '../../screens';
import './DepositFiat.scss';

const DepositFiat: React.FC = () => {
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const {
        data: iframeUrl,
        error,
        isLoading: isDepositFiatLoading,
        mutate: mutateDepositFiat,
    } = useCashierFiatAddress();
    const [isIframeLoading, setIsIframeLoading] = useState(true);

    useEffect(() => {
        if (isAuthorizeSuccess) {
            mutateDepositFiat('deposit');
        }
    }, [isAuthorizeSuccess, mutateDepositFiat]);

    if (isDepositFiatLoading) return <Loader />;

    if (isServerError(error?.error)) {
        return <DepositErrorScreen error={error?.error} />;
    }

    return (
        <React.Fragment>
            {isIframeLoading && <Loader />}
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

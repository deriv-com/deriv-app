import React, { useEffect, useState } from 'react';
import { useAuthorize, useCashierFiatAddress } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { ErrorScreen } from '../../components';
import { isServerError } from '../../utils';
import styles from './DepositFiat.module.scss';

const DepositFiat = () => {
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data: iframeUrl, error: depositError, isError, mutate } = useCashierFiatAddress();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthorizeSuccess) {
            mutate('deposit');
        }
    }, [isAuthorizeSuccess, mutate]);

    useEffect(() => {
        setIsLoading(true);
    }, []);

    if (isError && isServerError(depositError.error)) return <ErrorScreen message={depositError.error.message} />;

    return (
        <React.Fragment>
            {isLoading && <Loader />}
            {iframeUrl && (
                <iframe
                    className={styles.iframe}
                    data-testid='dt_deposit-fiat-iframe'
                    key={iframeUrl}
                    onLoad={() => setIsLoading(false)}
                    src={iframeUrl}
                    style={{ display: isLoading ? 'none' : 'block' }}
                    title='deposit_fiat_iframe'
                />
            )}
        </React.Fragment>
    );
};

export default DepositFiat;

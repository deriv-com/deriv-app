import React, { useEffect } from 'react';
import { useCashierFiatAddress } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { ErrorScreen } from '../../components';
import { isServerError } from '../../utils';
import styles from './WithdrawalFiat.module.scss';

type WithdrawalFiatProps = {
    verificationCode?: string;
};

const WithdrawalFiat: React.FC<WithdrawalFiatProps> = ({ verificationCode }) => {
    const { data: iframeUrl, error: withdrawalFiatError, isError, isLoading, mutate } = useCashierFiatAddress();

    useEffect(() => {
        if (verificationCode) {
            mutate('withdraw', {
                verification_code: verificationCode,
            });
        }
    }, [mutate, verificationCode]);

    if (isError && isServerError(withdrawalFiatError.error)) {
        return <ErrorScreen message={withdrawalFiatError.error.message} />;
    }

    return (
        <React.Fragment>
            {isLoading && <Loader />}
            {iframeUrl && (
                <iframe
                    className={styles.iframe}
                    data-testid='dt_withdrawal_fiat_iframe'
                    key={iframeUrl}
                    src={iframeUrl}
                    style={{ display: isLoading ? 'none' : 'block' }}
                    title='withdrawal_fiat_iframe'
                />
            )}
        </React.Fragment>
    );
};

export default WithdrawalFiat;

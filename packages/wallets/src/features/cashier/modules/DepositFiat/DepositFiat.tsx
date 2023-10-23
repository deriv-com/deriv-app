import React, { useEffect, useState } from 'react';
import { useAuthorize, useDepositFiatAddress } from '@deriv/api';
import { isServerError } from '../../../../utils/utils';
import { WalletsErrorScreen } from '../../../../components';
import './DepositFiat.scss';

const DepositFiat = () => {
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data: iframeUrl, error: depositError, isError, mutate } = useDepositFiatAddress();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
    }, [iframeUrl]);

    useEffect(() => {
        if (isAuthorizeSuccess) {
            mutate();
        }
    }, [isAuthorizeSuccess, mutate]);

    //@ts-expect-error need to come up with a way to type an error in ReactQuery
    if (isError && isServerError(depositError.error))
        //@ts-expect-error need to come up with a way to type an error in ReactQuery
        return <WalletsErrorScreen message={depositError.error.message} />;

    return (
        <React.Fragment>
            {isLoading && <p>Loading...</p>}
            {iframeUrl && (
                <iframe
                    className='wallets-deposit-fiat__iframe'
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

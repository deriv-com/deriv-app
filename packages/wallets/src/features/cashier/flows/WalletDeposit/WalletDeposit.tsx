import React, { useEffect } from 'react';
import { useActiveWalletAccount, useAuthorize, useCashierFiatAddress, useDepositCryptoAddress } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import { isServerError } from '../../../../utils/utils';
import { DepositCryptoModule, DepositFiatModule } from '../../modules';
import { DepositErrorScreen } from '../../screens';

const WalletDeposit = () => {
    const { data } = useActiveWalletAccount();
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const {
        error: depositFiatError,
        isLoading: isFiatAddressLoading,
        mutate: mutateDepositFiat,
    } = useCashierFiatAddress();
    const {
        error: depositCryptoError,
        isLoading: isCryptoAddressLoading,
        mutate: mutateDepositCrypto,
    } = useDepositCryptoAddress();

    const isLoading = isFiatAddressLoading || isCryptoAddressLoading;
    const isCrypto = data?.currency_config?.is_crypto;
    const depositError = isCrypto ? depositCryptoError?.error : depositFiatError?.error;

    const getErrorTitle = (errorCode: string) => {
        if (errorCode === 'CryptoSuspendedCurrency') return 'Error';
        //TODO: add check for crypto node down
        return undefined;
    };

    const errorTitle = depositError ? getErrorTitle(depositError.code) : undefined;

    useEffect(() => {
        if (isAuthorizeSuccess) {
            if (isCrypto) {
                mutateDepositCrypto();
            } else {
                mutateDepositFiat('deposit');
            }
        }
    }, [isAuthorizeSuccess, isCrypto, mutateDepositCrypto, mutateDepositFiat]);

    if (isLoading) return <Loader />;

    if (isServerError(depositError)) {
        return <DepositErrorScreen error={depositError} title={errorTitle} />;
    }

    return isCrypto ? <DepositCryptoModule /> : <DepositFiatModule />;
};

export default WalletDeposit;

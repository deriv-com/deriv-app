import { useCallback, useEffect, useState } from 'react';

import { getToken } from '@deriv/utils';
import { getInitialLanguage, useTranslations } from '@deriv-com/translations';

import { useAPIContext } from '../APIProvider';
import useMutation from '../useMutation';

import useAuthorize from './useAuthorize';

type TCashierParam = NonNullable<
    Parameters<ReturnType<typeof useMutation<'cashier'>>['mutate']>
>[0]['payload']['cashier'];

type TParams = Omit<
    NonNullable<Parameters<ReturnType<typeof useMutation<'cashier'>>['mutate']>>[0]['payload'],
    'cashier' | 'provider'
>;

/** A custom hook to get the deposit and withdrawal fiat address. */
const useCashierFiatDepositAddress = () => {
    const { data: authorizeData, isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { mutateAsync: mutateAsyncAuthorize } = useMutation('authorize');
    const { data, mutateAsync: _mutateAsync, ...rest } = useMutation('cashier');

    const iframe_url = typeof data?.cashier === 'string' ? `${data?.cashier}&DarkMode=off` : undefined;
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const { setOnReconnected } = useAPIContext();
    const i18nLanguage = getInitialLanguage();
    const { currentLang } = useTranslations();
    const loginid = authorizeData.loginid;

    const mutateAsync = useCallback(
        (cashier: TCashierParam, payload?: TParams) =>
            _mutateAsync({ payload: { cashier, provider: 'doughflow', ...payload } }),
        [_mutateAsync]
    );

    // This useEffect is used to handle deposit fiat address as usual
    useEffect(() => {
        if (isAuthorizeSuccess) {
            setIsAuthorizing(true);
            mutateAsync('deposit').then(() => setIsAuthorizing(false));
        }
    }, [isAuthorizeSuccess, mutateAsync]);

    // This useEffect is used to handle deposit fiat address when the language is changed
    useEffect(() => {
        if (!loginid) return;

        if (currentLang !== i18nLanguage) {
            setIsAuthorizing(true);
            setOnReconnected(async () => {
                await mutateAsyncAuthorize({ payload: { authorize: getToken(loginid || '') ?? '' } });
                await mutateAsync('deposit');
                setIsAuthorizing(false);
                // Reset the onReconnected callback to avoid multiple calls
                setOnReconnected(() => undefined);
            });
        }
    }, [currentLang, i18nLanguage, loginid, mutateAsync, mutateAsyncAuthorize, setOnReconnected]);

    return {
        ...rest,
        /** The deposit/withdrawal fiat iframe */
        data: iframe_url,
        /** Function to get deposit/withdrawal fiat address */
        isAuthorizing,
    };
};

export default useCashierFiatDepositAddress;

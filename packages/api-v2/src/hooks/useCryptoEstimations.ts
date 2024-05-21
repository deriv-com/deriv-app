import { useCallback, useEffect, useState } from 'react';
import useMutation from '../useMutation';
import { TSocketError } from '../../types';
import { epochToMoment } from '@deriv/utils';

/** A custom hook that returns the crypto_estimations fee for given currency code along with count_down and an unique_id */
const useCryptoEstimations = () => {
    const { mutateAsync: mutateAsyncCryptoEstimation, isLoading } = useMutation('crypto_estimations');
    const { mutateAsync: mutateAsyncTime } = useMutation('time');
    const [cryptoEstimationsFeeExpiryTime, setCryptoEstimationsFeeExpiryTime] = useState<number>(0);
    const [cryptoEstimationsFee, setCryptoEstimationsFee] = useState<number>(0);
    const [cryptoEstimationsFeeUniqueId, setCryptoEstimationsFeeUniqueId] = useState<string>('');
    const [currencyCode, setCurrencyCode] = useState<string>('BTC');
    const [error, setError] = useState<TSocketError<'crypto_estimations'>['error']>();
    const [countDown, setCountDown] = useState<number>(0);
    const [serverTime, setServerTime] = useState<string>('');

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (cryptoEstimationsFeeExpiryTime && !timer && countDown >= 0) {
            timer = setTimeout(() => {
                if (countDown === 0) {
                    clearTimeout(timer);
                    getCryptoEstimations(currencyCode);
                    return;
                }
                setCountDown(prevTime => prevTime - 1);
            }, 1000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cryptoEstimationsFeeExpiryTime, countDown]);

    const getCryptoEstimations = useCallback(
        async (currencyCode: string) => {
            setCurrencyCode(currencyCode);
            try {
                const { crypto_estimations } = await mutateAsyncCryptoEstimation({
                    payload: {
                        currency_code: currencyCode,
                    },
                });

                const { time } = await mutateAsyncTime();
                setServerTime(
                    epochToMoment(time ?? 0)
                        .utc()
                        .format('HH:mm:ss')
                );

                if (crypto_estimations?.[currencyCode].withdrawal_fee?.expiry_time && time) {
                    const expiry_time =
                        epochToMoment(crypto_estimations?.[currencyCode]?.withdrawal_fee?.expiry_time ?? 0).diff(
                            epochToMoment(time),
                            'seconds'
                        ) - 1;
                    setCountDown(expiry_time);
                    setCryptoEstimationsFee(crypto_estimations?.[currencyCode]?.withdrawal_fee?.value || 0);
                    setCryptoEstimationsFeeUniqueId(
                        crypto_estimations?.[currencyCode]?.withdrawal_fee?.unique_id || ''
                    );
                    setCryptoEstimationsFeeExpiryTime(
                        crypto_estimations?.[currencyCode]?.withdrawal_fee?.expiry_time ?? 0
                    );
                }
            } catch (error: unknown) {
                setError((error as TSocketError<'crypto_estimations'>).error);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [cryptoEstimationsFeeExpiryTime]
    );

    return {
        countDown,
        cryptoEstimationsFee,
        cryptoEstimationsFeeUniqueId,
        cryptoEstimationsFeeExpiryTime,
        error,
        getCryptoEstimations,
        isLoading,
        serverTime,
    };
};

export default useCryptoEstimations;

import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import useMutation from '../useMutation';
import { TSocketError } from '../../types';

/** A custom hook that returns the crypto_estimations fee for given currency code along with count_down and an unique_id */
const useCryptoEstimations = () => {
    const { mutateAsync: mutateAsyncCryptoEstimation } = useMutation('crypto_estimations');
    const { mutateAsync: mutateAsyncTime } = useMutation('time');
    const [crypto_estimations_fee_expiry_time, setCryptoEstimationsFeeExpiryTime] = useState<number>(0);
    const [crypto_estimations_fee, setCryptoEstimationsFee] = useState<number>(0);
    const [crypto_estimations_fee_unique_id, setCryptoEstimationsFeeUniqueId] = useState<string>('');
    const [currency_code, setCurrencyCode] = useState<string>('BTC');
    const [error, setError] = useState<TSocketError<'crypto_estimations'>['error']>();
    const [count_down, setCountDown] = useState<number>(0);
    const [serve_time, setServeTime] = useState<string>('');

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (crypto_estimations_fee_expiry_time && !timer && count_down >= 0) {
            timer = setTimeout(() => {
                if (count_down === 0) {
                    clearInterval(timer);
                    setCryptoEstimationsFeeUniqueId('');
                    getCryptoEstimations(currency_code);
                    return;
                }
                setCountDown(prevTime => prevTime - 1);
            }, 1000);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crypto_estimations_fee_expiry_time, count_down]);

    const getCryptoEstimations = useCallback(
        async (currency_code: string) => {
            setCurrencyCode(currency_code);
            try {
                const { crypto_estimations } = await mutateAsyncCryptoEstimation({
                    payload: {
                        currency_code,
                    },
                });

                const { time } = await mutateAsyncTime();
                setServeTime(
                    `${moment((time ?? 0) * 1000)
                        .utc()
                        .format('HH:mm:ss')} GMT`
                );

                if (crypto_estimations?.[currency_code].withdrawal_fee?.expiry_time && time) {
                    const expiry_time =
                        moment((crypto_estimations?.[currency_code]?.withdrawal_fee?.expiry_time ?? 0) * 1000).diff(
                            moment(time * 1000),
                            'seconds'
                        ) - 1;
                    setCountDown(expiry_time);
                    setCryptoEstimationsFee(crypto_estimations?.[currency_code]?.withdrawal_fee?.value ?? 0);
                    setCryptoEstimationsFeeUniqueId(
                        crypto_estimations?.[currency_code]?.withdrawal_fee?.unique_id ?? ''
                    );
                    setCryptoEstimationsFeeExpiryTime(
                        crypto_estimations?.[currency_code]?.withdrawal_fee?.expiry_time ?? 0
                    );
                }
            } catch (error: unknown) {
                setError(error as TSocketError<'crypto_estimations'>['error']);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [crypto_estimations_fee_expiry_time]
    );

    return {
        count_down,
        crypto_estimations_fee,
        crypto_estimations_fee_expiry_time,
        crypto_estimations_fee_unique_id,
        error,
        getCryptoEstimations,
        serve_time,
    };
};

export default useCryptoEstimations;

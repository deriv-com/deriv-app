import { useEffect, useRef, useState } from 'react';
import { epochToMoment, toMoment } from '@deriv/utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CryptoEstimations } from '@deriv/api-types';
import { TSocketError } from '../../types';
import useSubscription from '../useSubscription';

/** A custom hook that returns the crypto_estimations fee for given currency code along with count_down and an unique_id */
const useCryptoEstimations = () => {
    const { subscribe, data, error: subscription_error, unsubscribe } = useSubscription('crypto_estimations');
    const [crypto_estimations_fee_details, setCryptoEstimationsFeeDetails] = useState<
        CryptoEstimations['k']['withdrawal_fee']
    >({});
    const [crypto_estimations_fee_details_latest, setCryptoEstimationsFeeDetailsLatest] = useState<
        CryptoEstimations['k']['withdrawal_fee']
    >({});
    const [currency_code, setCurrencyCode] = useState<string>('BTC');
    const [error, setError] = useState<TSocketError<'crypto_estimations'>['error']>();
    const [count_down, setCountDown] = useState<number>(0);
    const [server_time, setServerTime] = useState<string>('');
    const timer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (data?.crypto_estimations?.[currency_code].withdrawal_fee?.expiry_time) {
            setCryptoEstimationsFeeDetailsLatest(data?.crypto_estimations?.[currency_code].withdrawal_fee ?? {});
        }
    }, [currency_code, data]);

    useEffect(() => {
        if (subscription_error) setError(subscription_error as unknown as TSocketError<'crypto_estimations'>['error']);
    }, [subscription_error]);

    useEffect(() => {
        if (crypto_estimations_fee_details_latest?.expiry_time && count_down === 0) {
            setCryptoEstimationsFeeDetails(crypto_estimations_fee_details_latest);
            const currentTime = toMoment();
            setServerTime(`${currentTime.utc().format('HH:mm:ss')} GMT`);
            const expiryTime =
                epochToMoment(crypto_estimations_fee_details_latest?.expiry_time ?? 0).diff(currentTime, 'seconds') - 1;
            setCountDown(expiryTime);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count_down, crypto_estimations_fee_details_latest?.expiry_time]);

    useEffect(() => {
        timer.current = setTimeout(() => {
            if (count_down === 1) {
                clearTimeout(timer.current as NodeJS.Timeout);
                setCountDown(prevTime => prevTime - 1);
            } else if (count_down > 0) {
                setCountDown(prevTime => prevTime - 1);
            }
        }, 1000);

        return () => {
            if (timer) {
                clearInterval(timer.current as NodeJS.Timeout);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count_down]);

    return {
        count_down,
        crypto_estimations_fee: crypto_estimations_fee_details?.value ?? 0,
        crypto_estimations_fee_unique_id: crypto_estimations_fee_details?.unique_id ?? '',
        crypto_estimations_fee_expiry_time: crypto_estimations_fee_details?.expiry_time ?? 0,
        error,
        getCryptoEstimations: subscribe,
        setCurrencyCode,
        server_time,
        unsubscribeCryptoEstimations: unsubscribe,
    };
};

export default useCryptoEstimations;

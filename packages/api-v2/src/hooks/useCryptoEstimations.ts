import { useEffect, useRef, useState } from 'react';
import { epochToMoment, toMoment } from '@deriv/utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CryptoEstimations } from '@deriv/api-types';
import { TSocketError } from '../../types';
import useSubscription from '../useSubscription';

/** A custom hook that returns the crypto_estimations fee for given currency code along with count_down and an unique_id */
const useCryptoEstimations = () => {
    const {
        subscribe,
        data,
        error: subscription_error,
        isLoading,
        unsubscribe,
    } = useSubscription('crypto_estimations');
    const [cryptoEstimationsFeeDetails, setCryptoEstimationsFeeDetails] = useState<
        CryptoEstimations['k']['withdrawal_fee']
    >({});
    const [cryptoEstimationsFeeDetailsLatest, setCryptoEstimationsFeeDetailsLatest] = useState<
        CryptoEstimations['k']['withdrawal_fee']
    >({});
    const [currencyCode, setCurrencyCode] = useState<string>('BTC');
    const [error, setError] = useState<TSocketError<'crypto_estimations'>['error']>();
    const [countDown, setCountDown] = useState<number>(0);
    const [serverTime, setServerTime] = useState<string>('');
    const timer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (data?.crypto_estimations?.[currencyCode].withdrawal_fee?.expiry_time) {
            setCryptoEstimationsFeeDetailsLatest(data?.crypto_estimations?.[currencyCode].withdrawal_fee ?? {});
        }
    }, [currencyCode, data]);

    useEffect(() => {
        if (subscription_error) setError(subscription_error as unknown as TSocketError<'crypto_estimations'>['error']);
    }, [subscription_error]);

    useEffect(() => {
        if (cryptoEstimationsFeeDetailsLatest?.expiry_time && countDown === 0) {
            setCryptoEstimationsFeeDetails(cryptoEstimationsFeeDetailsLatest);
            const currentTime = toMoment();
            setServerTime(`${currentTime.utc().format('HH:mm:ss')} GMT`);
            const expiryTime =
                epochToMoment(cryptoEstimationsFeeDetailsLatest?.expiry_time ?? 0).diff(currentTime, 'seconds') - 1;
            setCountDown(expiryTime);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countDown, cryptoEstimationsFeeDetailsLatest?.expiry_time]);

    useEffect(() => {
        timer.current = setTimeout(() => {
            if (countDown === 1) {
                clearTimeout(timer.current as NodeJS.Timeout);
                setCountDown(prevTime => prevTime - 1);
            } else if (countDown > 0) {
                setCountDown(prevTime => prevTime - 1);
            }
        }, 1000);

        return () => {
            if (timer) {
                clearInterval(timer.current as NodeJS.Timeout);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countDown]);

    return {
        countDown,
        cryptoEstimationsFee: cryptoEstimationsFeeDetails?.value ?? 0,
        cryptoEstimationsFeeUniqueId: cryptoEstimationsFeeDetails?.unique_id ?? '',
        cryptoEstimationsFeeExpiryTime: cryptoEstimationsFeeDetails?.expiry_time ?? 0,
        error,
        getCryptoEstimations: subscribe,
        isLoading,
        setCurrencyCode,
        serverTime,
        unsubscribeCryptoEstimations: unsubscribe,
    };
};

export default useCryptoEstimations;

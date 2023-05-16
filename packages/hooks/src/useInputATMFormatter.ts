import { useCallback, useEffect, useMemo } from 'react';
import useInputDecimalFormatter from './useInputDecimalFormatter';

const unFormatLocaleStringifyNumber = (input: string, locale: Intl.LocalesArgument) => {
    const parts = (1234.5).toLocaleString(locale).match(/(\D+)/g);
    let unformatted = input;

    if (parts) {
        unformatted = unformatted.split(parts[0]).join('');
        unformatted = unformatted.split(parts[1]).join('.');

        return unformatted;
    }

    return input;
};

type TOprions = {
    fraction_digits?: number;
    locale?: Intl.LocalesArgument;
};

const useInputATMFormatter = (initial?: number, options?: TOprions) => {
    const { value, onChangeHandler: onChangeDecimalHandler } = useInputDecimalFormatter(undefined, options);
    const { locale, fraction_digits = 2 } = options || {};

    const onChangeHandler = useCallback(
        (new_value: string) => {
            const unformatted = unFormatLocaleStringifyNumber(new_value, locale);
            // Need to ignore this check as we shouldn't convert the type to number here because we will lose the trailing zeros.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const shifted = Math.fround(unformatted * 10).toFixed(fraction_digits);
            // Need to ignore this check as we shouldn't convert the type to number here because we will lose the trailing zeros.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const un_shifted = Math.fround(unformatted / 10).toFixed(fraction_digits);
            const unformatted_fraction = unformatted.split('.')?.[1]?.length || fraction_digits;

            // The new value has one more decimal places than the fraction_digits, so we need to shift the decimal point to the left.
            if (unformatted_fraction - 1 === fraction_digits) return onChangeDecimalHandler(shifted);

            // The new value has one less decimal places than the fraction_digits, so we need to shift the decimal point to the right.
            if (unformatted_fraction + 1 === fraction_digits) return onChangeDecimalHandler(un_shifted);

            // The new value has the same number of decimal places as the fraction_digits, so we don't need to shift the decimal point.
            if (unformatted_fraction === fraction_digits) return onChangeDecimalHandler(unformatted);

            // The new value has more decimal places than the fraction_digits, so we chop the extra decimal points.
            if (unformatted_fraction - 1 > fraction_digits) return onChangeDecimalHandler(unformatted);

            // The new value has less decimal places than the fraction_digits, so we add the missing extra decimal point.
            if (unformatted_fraction + 1 < fraction_digits) return onChangeDecimalHandler(unformatted);

            return onChangeDecimalHandler(unformatted);
        },
        [onChangeDecimalHandler, fraction_digits, locale]
    );

    useEffect(() => {
        onChangeHandler(`${initial}`);
    }, [initial, onChangeHandler]);

    const formatted_value = useMemo(
        () => `${Number(value).toLocaleString(locale, { minimumFractionDigits: fraction_digits })}`,
        [fraction_digits, locale, value]
    );

    return { value: formatted_value, onChangeHandler };
};

export default useInputATMFormatter;

import { useCallback, useEffect, useMemo, useRef } from 'react';
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
    const is_pasting = useRef(false);
    const { value, onChange: onChangeDecimal } = useInputDecimalFormatter(undefined, options);
    const { locale, fraction_digits = 2 } = options || {};

    const formatted_value = useMemo(
        () => `${Number(value).toLocaleString(locale, { minimumFractionDigits: fraction_digits })}`,
        [fraction_digits, locale, value]
    );

    const onChange = useCallback(
        (e: DeepPartial<React.ChangeEvent<HTMLInputElement>> | React.ChangeEvent<HTMLInputElement>) => {
            const new_value = e?.target?.value || '';
            const unformatted = unFormatLocaleStringifyNumber(new_value, locale);
            // @ts-expect-error shouldn't convert the type to number because we will lose the trailing zeros.
            const shifted = Math.fround(unformatted * 10).toFixed(fraction_digits);
            // @ts-expect-error shouldn't convert the type to number because we will lose the trailing zeros.
            const un_shifted = Math.fround(unformatted / 10).toFixed(fraction_digits);
            const unformatted_fraction = unformatted.split('.')?.[1]?.length || fraction_digits;

            // If the user is pasting, we don't need to shift the decimal point, We just need to format the value.
            if (is_pasting.current) {
                is_pasting.current = false;
                return onChangeDecimal({ target: { value: unformatted } });
            }

            // The new value has one more decimal places than the fraction_digits, so we need to shift the decimal point to the left.
            if (unformatted_fraction - 1 === fraction_digits) return onChangeDecimal({ target: { value: shifted } });

            // The new value has one less decimal places than the fraction_digits, so we need to shift the decimal point to the right.
            if (unformatted_fraction + 1 === fraction_digits) return onChangeDecimal({ target: { value: un_shifted } });

            // The new value has the same number of decimal places as the fraction_digits, so we don't need to shift the decimal point.
            if (unformatted_fraction === fraction_digits) return onChangeDecimal({ target: { value: unformatted } });

            // The new value has more decimal places than the fraction_digits, so we chop the extra decimal points.
            if (unformatted_fraction - 1 > fraction_digits) return onChangeDecimal({ target: { value: unformatted } });

            // The new value has less decimal places than the fraction_digits, so we add the missing extra decimal point.
            if (unformatted_fraction + 1 < fraction_digits) return onChangeDecimal({ target: { value: unformatted } });

            return onChangeDecimal({ target: { value: unformatted } });
        },
        [locale, fraction_digits, onChangeDecimal]
    );

    const onPaste: React.ClipboardEventHandler<HTMLInputElement> = useCallback(
        e => (is_pasting.current = e.type === 'paste'),
        []
    );

    useEffect(() => {
        onChange({ target: { value: `${initial}` } });
    }, [initial, onChange]);

    return { value: formatted_value, onChange, onPaste };
};

export default useInputATMFormatter;

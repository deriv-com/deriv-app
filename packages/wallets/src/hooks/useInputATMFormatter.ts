import { useCallback, useEffect, useMemo, useRef } from 'react';
import { unFormatLocaleString } from '@deriv/utils';
import useInputDecimalFormatter from './useInputDecimalFormatter';

type TOptions = {
    fractionDigits?: number;
    locale?: Intl.LocalesArgument;
};

const useInputATMFormatter = (initial?: number, options?: TOptions) => {
    const isPasting = useRef(false);
    const { onChange: onChangeDecimal, value } = useInputDecimalFormatter(undefined, options);
    const { fractionDigits = 2, locale } = options || {};

    const formattedValue = useMemo(
        () => `${Number(value).toLocaleString(locale, { minimumFractionDigits: fractionDigits })}`,
        [fractionDigits, locale, value]
    );

    const onChange = useCallback(
        (e: DeepPartial<React.ChangeEvent<HTMLInputElement>> | React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e?.target?.value || '';
            const unformatted = unFormatLocaleString(newValue, locale);
            // @ts-expect-error shouldn't cast to number because we will lose the trailing zeros.
            const shifted = Math.fround(unformatted * 10).toFixed(fractionDigits);
            // @ts-expect-error shouldn't cast to number because we will lose the trailing zeros.
            const unShifted = Math.fround(unformatted / 10).toFixed(fractionDigits);
            const unformattedFraction = unformatted.split('.')?.[1]?.length || fractionDigits;

            // If the user is pasting, we don't need to shift the decimal point,
            // We just need to format the value.
            if (isPasting.current) {
                isPasting.current = false;
                return onChangeDecimal({ target: { value: unformatted } });
            }

            // The new value has one more decimal places than the fraction digits,
            // so we need to shift the decimal point to the left.
            if (unformattedFraction - 1 === fractionDigits) {
                return onChangeDecimal({ target: { value: shifted } });
            }

            // The new value has one less decimal places than the fraction digits,
            // so we need to shift the decimal point to the right.
            if (unformattedFraction + 1 === fractionDigits) {
                return onChangeDecimal({ target: { value: unShifted } });
            }

            // The new value has the same number of decimal places as the fraction digits,
            // so we don't need to shift the decimal point.
            if (unformattedFraction === fractionDigits) {
                return onChangeDecimal({ target: { value: unformatted } });
            }

            // The new value has more decimal places than the fraction digits,
            // so we chop the extra decimal points.
            if (unformattedFraction - 1 > fractionDigits) {
                return onChangeDecimal({ target: { value: unformatted } });
            }

            // The new value has less decimal places than the fraction digits,
            // so we add the missing extra decimal point.
            if (unformattedFraction + 1 < fractionDigits) {
                return onChangeDecimal({ target: { value: unformatted } });
            }

            return onChangeDecimal({ target: { value: unformatted } });
        },
        [locale, fractionDigits, onChangeDecimal]
    );

    const onPaste: React.ClipboardEventHandler<HTMLInputElement> = useCallback(
        e => (isPasting.current = e.type === 'paste'),
        []
    );

    useEffect(() => {
        if (initial) {
            isPasting.current = true;
            onChange({
                target: {
                    value: `${Number(initial).toLocaleString(locale, { minimumFractionDigits: fractionDigits })}`,
                },
            });
        }
    }, [fractionDigits, initial, locale, onChange]);

    return { onChange, onPaste, value: formattedValue };
};

export default useInputATMFormatter;

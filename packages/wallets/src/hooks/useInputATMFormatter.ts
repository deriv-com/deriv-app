import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { unFormatLocaleString } from '@deriv/utils';
import useInputDecimalFormatter from './useInputDecimalFormatter';

type TOptions = {
    fractionDigits?: number;
    locale?: Intl.LocalesArgument;
    maxDigits?: number;
};

const separatorRegex = /[,.]/g; // locale-agnostic

const useInputATMFormatter = (inputRef: React.RefObject<HTMLInputElement>, initial?: number, options?: TOptions) => {
    const input = inputRef.current;

    const isPasting = useRef(false);
    const { onChange: onChangeDecimal, value } = useInputDecimalFormatter(undefined, options);
    const { fractionDigits = 2, locale, maxDigits = 14 } = options || {};

    const formattedValue = useMemo(
        () => `${Number(value).toLocaleString(locale, { minimumFractionDigits: fractionDigits })}`,
        [fractionDigits, locale, value]
    );

    // maintain the input state to compare new values to it on every change
    const [prevFormattedValue, setPrevFormattedValue] = useState<string>(formattedValue);
    useEffect(() => {
        setPrevFormattedValue(formattedValue);
    }, [formattedValue]);

    // keep the caret from jumping
    const [caretNeedsRepositioning, setCaretNeedsRepositioning] = useState<boolean>(false);
    const [caret, setCaret] = useState<number>();
    useEffect(() => {
        if (caret && caretNeedsRepositioning && input) {
            const indexBeforeCaret = formattedValue.length - 1 - caret;

            // if before a comma or period, prefer positioning the caret to the left of it
            const newCaretPosition = separatorRegex.test(formattedValue[indexBeforeCaret])
                ? indexBeforeCaret
                : indexBeforeCaret + 1;

            input.setSelectionRange(newCaretPosition, newCaretPosition);
            setCaretNeedsRepositioning(false);
        }
    }, [caret, formattedValue, caretNeedsRepositioning, input]);

    const checkExceedsMaxDigits = useCallback(
        (newValue: string) => {
            if (!input) return true;

            // drop the changes if the number of digits is not decreasing and it has exceeded maxDigits
            const inputDigitsCount = input.value.replace(separatorRegex, '').replace(/^0+/, '').length;
            const changeDigitsCount = newValue.replace(separatorRegex, '').replace(/^0+/, '').length ?? 0;
            return maxDigits && changeDigitsCount >= inputDigitsCount && changeDigitsCount > maxDigits;
        },
        [input, maxDigits]
    );

    const handleNewValue = useCallback(
        (newValue: string) => {
            if (!input) return;

            const newCaretPosition = input.value.length - (input.selectionStart ?? 0);
            setCaret(newCaretPosition);
            setCaretNeedsRepositioning(true);

            const hasNoChangeInDigits =
                input.value.length + 1 === prevFormattedValue.length &&
                input.value.replaceAll(separatorRegex, '') === prevFormattedValue.replaceAll(separatorRegex, '');
            if (hasNoChangeInDigits) return;

            const unformatted = unFormatLocaleString(newValue, locale);
            const shifted = (Number(unformatted) * 10).toFixed(fractionDigits);
            const unShifted = (Number(unformatted) / 10).toFixed(fractionDigits);
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
        [input, prevFormattedValue, locale, fractionDigits, onChangeDecimal]
    );

    const onChange = useCallback(
        (e: DeepPartial<React.ChangeEvent<HTMLInputElement>> | React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target?.value;
            if (typeof newValue === 'undefined') return;
            if (checkExceedsMaxDigits(newValue)) return;
            handleNewValue(newValue);
        },
        [checkExceedsMaxDigits, handleNewValue]
    );

    const onPaste: React.ClipboardEventHandler<HTMLInputElement> = useCallback(
        e => {
            isPasting.current = e.type === 'paste';
            if (Number(unFormatLocaleString(formattedValue, locale)) === 0) {
                const pasted = (e.clipboardData || window.clipboardData).getData('Text');
                const pastedValue = Number(unFormatLocaleString(pasted, locale));
                const pastedValueFormatted = `${pastedValue.toLocaleString(locale, {
                    minimumFractionDigits: fractionDigits,
                })}`;
                if (
                    !isNaN(pastedValue) &&
                    isFinite(pastedValue) &&
                    pastedValue >= 0 &&
                    !checkExceedsMaxDigits(pastedValueFormatted)
                )
                    onChange({
                        target: {
                            value: pastedValueFormatted,
                        },
                    });
            }
        },
        [checkExceedsMaxDigits, formattedValue, fractionDigits, locale, onChange]
    );

    useEffect(() => {
        if (typeof initial === 'number') {
            isPasting.current = true;
            handleNewValue(`${Number(initial).toLocaleString(locale, { minimumFractionDigits: fractionDigits })}`);
        }
    }, [fractionDigits, handleNewValue, initial, locale, onChange]);

    return { onChange, onPaste, value: formattedValue };
};

export default useInputATMFormatter;

import React, { KeyboardEventHandler, useCallback, useEffect, useState } from 'react';
import { isMobile } from '@deriv/shared';
import Input from '../input';
import Text from '../text';

type TAmountInput = {
    currency: string;
    decimal_places?: number;
    disabled?: boolean;
    initial_value?: number;
    label?: string;
    locale?: Intl.LocalesArgument;
    max_digits?: number;
    onChange?: (value: number) => void;
};

const AmountInput = ({
    currency,
    decimal_places = 2,
    disabled = false,
    initial_value = 0,
    label,
    locale,
    max_digits = 8,
    onChange,
}: TAmountInput) => {
    const [value, setValue] = useState(initial_value);
    const [focus, setFocus] = useState(false);
    const [is_pasting, setIsPasting] = useState(false);
    const [caret_right_offset, setCaretRightOffset] = useState(0);
    const [selection, setSelection] = useState<{
        selectionStart: number;
        selectionEnd: number;
    }>({ selectionStart: 0, selectionEnd: 0 });
    const [target, setTarget] = useState<React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>['target']>();

    const displayNumber = useCallback(
        (number: number) => number.toLocaleString(locale, { minimumFractionDigits: decimal_places }),
        [decimal_places, locale]
    );

    useEffect(() => {
        // update caret position every time the value changes (this happens after onChange)
        const updated_caret_position = displayNumber(value).length - caret_right_offset;
        target?.setSelectionRange(updated_caret_position, updated_caret_position);
        setSelection({ selectionStart: updated_caret_position, selectionEnd: updated_caret_position });
    }, [value]);

    const onChangeHandler: React.ComponentProps<typeof Input>['onChange'] = e => {
        if (!target) setTarget(e.target);
        let newValue = value;
        if (!is_pasting) {
            // remove all characters that are not digit / point / comma:
            const input_value = e.target.value.replace(/[^\d.,]/g, '');
            // handle ATM typing:
            if (input_value.replace(/[.,]/g, '').replace(/^0+/g, '').length <= max_digits)
                newValue = Number(input_value.replace(/[.,]/g, '')) / Math.pow(10, decimal_places);
        } else {
            // handle pasting:
            const selection_length = selection.selectionEnd - selection.selectionStart;
            const pasted_string_length = e.target.value.length - selection_length - displayNumber(value).length;
            const pasted_string = e.target.value.substring(
                selection.selectionStart,
                selection.selectionStart + pasted_string_length
            );
            // remove all characters that are not digit / point / comma:
            const input_value = e.target.value.replace(/[^\d.,]/g, '');
            // understand the thing user wants to paste:
            const pasted_value = pasted_string
                .replace(/[^\d.,]/g, '')
                .replace(/[,.](?=.*[,.])/g, '')
                .replace(',', '.');
            if ((value === 0 && caret_right_offset === 0) || selection_length === displayNumber(value).length) {
                // handle pasting when there's nothing entered before it, or it is overridden:
                newValue = Number(pasted_value.substring(0, pasted_value.includes('.') ? max_digits + 1 : max_digits));
            } else if (input_value.replace(/[.,]/g, '').replace(/^0+/g, '').length <= max_digits) {
                // handle pasting when there's something entered before it and there's space for the pasted value:
                newValue = Number(input_value.replace(/[.,]/g, '')) / Math.pow(10, decimal_places);
            }
        }
        setValue(newValue);
        setIsPasting(false);
        onChange?.(newValue);
    };

    const onMouseDownHandler: React.ComponentProps<typeof Input>['onMouseDown'] = e => {
        if (e.currentTarget.selectionStart !== null && e.currentTarget.selectionEnd !== null) {
            setCaretRightOffset(e.currentTarget.value.length - e.currentTarget.selectionEnd);
            setSelection({
                selectionStart: e.currentTarget.selectionStart,
                selectionEnd: e.currentTarget.selectionEnd,
            });
        }
    };

    const onKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = e => {
        if (e.currentTarget.selectionStart !== null && e.currentTarget.selectionEnd !== null) {
            setCaretRightOffset(e.currentTarget.value.length - e.currentTarget.selectionEnd);
            setSelection({
                selectionStart: e.currentTarget.selectionStart,
                selectionEnd: e.currentTarget.selectionEnd,
            });
        }
    };

    return (
        <div className='amount-input-wrapper'>
            <Text size={isMobile() ? 'xxs' : 'xs'}>{label}</Text>
            <div className='amount-input-container'>
                <Input
                    className='amount-input'
                    disabled={disabled || focus}
                    type='text'
                    inputMode='numeric'
                    value={`${displayNumber(value)} ${currency}`}
                />
                <Input
                    className='amount-input'
                    data-testid='dt_amount-input'
                    disabled={disabled}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onChange={onChangeHandler}
                    onKeyDown={onKeyDownHandler}
                    onMouseDown={onMouseDownHandler}
                    onPaste={() => setIsPasting(true)}
                    type='text'
                    inputMode='numeric'
                    value={displayNumber(value)}
                />
            </div>
        </div>
    );
};

export default AmountInput;

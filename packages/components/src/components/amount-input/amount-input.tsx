import React, { KeyboardEventHandler, useCallback, useState } from 'react';
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
    const [isPasting, setIsPasting] = useState(false);

    const displayNumber = useCallback(
        (number: number) => number.toLocaleString(locale, { minimumFractionDigits: decimal_places }),
        [decimal_places, locale]
    );

    const onChangeHandler: React.ComponentProps<typeof Input>['onChange'] = e => {
        // remove all characters that are not digit / point / comma:
        const input_value = e.target.value.replace(/[^\d.,]/g, '');
        let newValue = value;
        if (!isPasting) {
            // handle ATM typing:
            if (input_value.replace(/[.,]/g, '').replace(/^0+/g, '').length <= max_digits)
                newValue = Number(input_value.replace(/[.,]/g, '')) / Math.pow(10, decimal_places);
        } else {
            // handle pasting:
            const pasted_string = input_value.substring(displayNumber(value).length);
            // get the presumable thing the user want to paste:
            const pasted_value = pasted_string.replace(/[,.](?=.*[,.])/g, '').replace(',', '.');
            if (!pasted_value) return;
            if (value === 0) {
                // handle pasting when there's nothing entered before it:
                newValue = Number(pasted_value.substring(0, pasted_value.includes('.') ? max_digits + 1 : max_digits));
            } else if (input_value.replace(/[.,]/g, '').replace(/^0+/g, '').length <= max_digits) {
                // handle pasting when there's something entered before it and there's space for the pasted value:
                newValue = Number(input_value.replace(/[.,]/g, '')) / Math.pow(10, decimal_places);
            }
        }

        setValue(newValue);
        onChange?.(newValue);
        setIsPasting(false);
    };

    const onMouseDownHandler: React.ComponentProps<typeof Input>['onMouseDown'] = e => {
        e.preventDefault();
        e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
        e.currentTarget.focus();
    };

    const onKeyDownHandler: KeyboardEventHandler<HTMLInputElement> = e => {
        if (e.code.startsWith('Arrow')) e.preventDefault();
    };

    return (
        <div className='amount-input-wrapper'>
            <Text size={isMobile() ? 'xxs' : 'xs'}>{label}</Text>
            <div className='amount-input-container'>
                <Input
                    className='amount-input'
                    disabled={disabled || focus}
                    type='text'
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
                    value={displayNumber(value)}
                />
            </div>
        </div>
    );
};

export default AmountInput;

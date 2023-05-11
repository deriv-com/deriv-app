import React, { useState } from 'react';
import Input from '../input';

type TAmountInput = {
    currency: string;
    decimalPoints?: number;
    disabled?: boolean;
    initialValue?: number;
    label?: string;
    maxDigits: number;
    onChange?: (value: number) => void;
};

const AmountInput = ({
    currency,
    decimalPoints = 2,
    disabled = false,
    initialValue = 0,
    label,
    maxDigits,
    onChange,
}: TAmountInput) => {
    const [value, setValue] = useState(initialValue);
    const [focus, setFocus] = useState(false);

    const displayNumber = (number: number) => number.toLocaleString('en-US', { minimumFractionDigits: decimalPoints });

    const onChangeHandler = (e: { target: { value: string } }) => {
        const input_value = e.target.value.replace(/\D/g, '');
        if (Number(input_value) <= Math.pow(10, maxDigits)) {
            setValue(Number(input_value) / 100);
            onChange?.(Number(input_value) / 100);
        }
    };

    return (
        <div className='amount-input-wrapper'>
            <span>{label}</span>
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
                    max_characters={displayNumber(Math.pow(10, maxDigits - 1) / decimalPoints).length}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onChange={onChangeHandler}
                    type='text'
                    value={displayNumber(value)}
                />
            </div>
        </div>
    );
};

Input.displayName = 'AmountInput';

export default AmountInput;

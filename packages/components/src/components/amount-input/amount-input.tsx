import React, { useState } from 'react';
import Input from '../input';
import Text from '../text';

type TAmountInput = {
    currency: string;
    decimal_points?: number;
    disabled?: boolean;
    initial_value?: number;
    label?: string;
    max_digits?: number;
    onChange?: (value: number) => void;
};

const AmountInput = ({
    currency,
    decimal_points = 2,
    disabled = false,
    initial_value = 0,
    label,
    max_digits = 8,
    onChange,
}: TAmountInput) => {
    const [value, setValue] = useState(initial_value);
    const [focus, setFocus] = useState(false);

    const displayNumber = (number: number) => number.toLocaleString('en-US', { minimumFractionDigits: decimal_points });

    const onChangeHandler = (e: { target: { value: string } }) => {
        const input_value = e.target.value.replace(/\D/g, '');
        if (Number(input_value) <= Math.pow(10, max_digits)) {
            setValue(Number(input_value) / 100);
            onChange?.(Number(input_value) / 100);
        }
    };

    return (
        <div className='amount-input-wrapper'>
            <Text size={'xs'}>{label}</Text>
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
                    type='text'
                    value={displayNumber(value)}
                />
            </div>
        </div>
    );
};

export default AmountInput;

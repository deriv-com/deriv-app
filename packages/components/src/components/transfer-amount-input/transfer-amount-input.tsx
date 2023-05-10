import React, { useState } from 'react';
import Input from '../input';

type TTransferAmountInput = {
    currency: string;
    decimalPoints?: number;
    disabled?: boolean;
    initialValue?: number;
    label?: React.ReactNode;
    maxDigits: number;
};

const TransferAmountInput = ({
    currency,
    decimalPoints = 2,
    disabled = false,
    initialValue = 0,
    label,
    maxDigits,
}: TTransferAmountInput) => {
    const [value, setValue] = useState(initialValue);
    const [focus, setFocus] = useState(false);

    const displayNumber = (number: number) => number.toLocaleString('en-US', { minimumFractionDigits: decimalPoints });

    return (
        <div className='transfer-amount-input-wrapper'>
            <span>{label}</span>
            <div className='transfer-amount-input-container'>
                <Input
                    className='transfer-amount-input'
                    disabled={focus}
                    type='text'
                    value={`${displayNumber(value)} ${currency}`}
                />
                <Input
                    className='transfer-amount-input'
                    disabled={disabled}
                    max_characters={displayNumber(Math.pow(10, maxDigits - 1) / decimalPoints).length}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onChange={e => {
                        const input_value = e.target.value.replace(/\D/g, '');
                        if (Number(input_value) <= Math.pow(10, maxDigits)) setValue(Number(input_value) / 100);
                    }}
                    type='text'
                    value={displayNumber(value)}
                />
            </div>
        </div>
    );
};

Input.displayName = 'TransferAmountInput';

export default TransferAmountInput;

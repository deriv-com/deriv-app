import React, { useState } from 'react';
import Input from '../input';

type TTransferAmountInput = {
    className?: string;
    currency: string;
    disabled?: boolean;
    initialValue?: number;
    label?: React.ReactNode;
};

const TransferAmountInput = ({ className, currency, disabled = false, initialValue, label }: TTransferAmountInput) => {
    const [value, setValue] = useState(0);

    return (
        <div className='transfer-amount-input-wrapper'>
            <span>{label}</span>
            <Input
                className='transfer-amount-input'
                disabled={disabled}
                onChange={e => {
                    let input_value = e.target.value;
                    input_value = input_value.replace(/\D/g, '');
                    setValue(Number(input_value) / 100);
                }}
                type={'text'}
                placeholder={`${value.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`}
                value={value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            />
        </div>
    );
};

Input.displayName = 'TransferAmountInput';

export default TransferAmountInput;

import React from 'react';
import Input from '../input';

type TTransferAmountInput = {
    className?: string;
    currency: string;
    disabled?: boolean;
    initialValue?: number;
    label?: React.ReactNode;
};

const TransferAmountInput = ({ className, currency, initialValue, disabled, label }: TTransferAmountInput) => {
    return (
        <div>
            <span>{label}</span>
            <Input
                type={'text'}
                disabled={disabled}
                onChange={e => {
                    let input_value = e.target.value;
                    input_value = input_value.replace(/\D/g, '');
                    input_value = (Number(input_value) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });
                    e.target.value = input_value;
                }}
            />
        </div>
    );
};

Input.displayName = 'TransferAmountInput';

export default TransferAmountInput;

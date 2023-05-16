import React, { useState } from 'react';
import { AmountInput } from '@deriv/components';

const AmountInputForTesting = () => {
    const [currency, setCurrency] = useState('USD');
    const [disabled, setDisabled] = useState(false);
    const [max_digits, setMaxDigits] = useState(8);
    const [decimal_points, setDecimalPoints] = useState(2);

    return (
        <div
            style={{
                padding: 20,
                border: 'solid red 2px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: 10,
                    fontSize: 16,
                }}
            >
                Currency:
                <input value={currency} onChange={e => setCurrency(e.target.value)} />
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: 10,
                    fontSize: 16,
                }}
            >
                Disabled:
                <input type='checkbox' onChange={() => setDisabled(!disabled)} />
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: 10,
                    fontSize: 16,
                }}
            >
                Max digits:
                <input
                    type='number'
                    value={max_digits}
                    min={decimal_points + 1}
                    max={12}
                    onChange={e => setMaxDigits(+e.target.value)}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: 10,
                    fontSize: 16,
                }}
            >
                Decimal points:
                <input
                    type='number'
                    min={1}
                    max={max_digits - 1}
                    value={decimal_points}
                    onChange={e => setDecimalPoints(+e.target.value)}
                />
            </div>
            <AmountInput
                currency={currency}
                disabled={disabled}
                label={'Amount you send'}
                max_digits={max_digits}
                decimal_places={decimal_points}
            />
        </div>
    );
};

export default AmountInputForTesting;

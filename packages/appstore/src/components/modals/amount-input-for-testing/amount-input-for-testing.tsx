import React from 'react';
import { AmountInput } from '@deriv/components';

const AmountInputForTesting = () => {
    return (
        <div
            style={{
                padding: 20,
                border: 'solid red 2px',
            }}
        >
            <AmountInput currency={'USD'} label={'Amount you send'} max_digits={8} />
        </div>
    );
};

export default AmountInputForTesting;

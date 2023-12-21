import React from 'react';
import { useActiveTradingAccount } from '@deriv/api';

function MockComponent() {
    const { data } = useActiveTradingAccount();

    // eslint-disable-next-line no-console
    console.log(data);
    return <div>MockComponent</div>;
}
export default MockComponent;

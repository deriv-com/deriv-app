import React from 'react';
import { observer } from '@deriv/stores';
import EditTradeTypes from './all-trade-types';

const Trade = observer(() => {
    return (
        <EditTradeTypes />
    );
});

export default Trade;

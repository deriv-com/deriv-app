import React from 'react';
import { Autocomplete, Icon, IconTradeTypes, SelectNative, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

const SymbolSelect = observer(() => {
    const { quick_strategy_store_1 } = useDBotStore();
    const { is_open } = quick_strategy_store_1;
    // eslint-disable-next-line no-console
    console.log(is_open, 'here');

    return <div>Symbol select will be here</div>;
});

export default SymbolSelect;

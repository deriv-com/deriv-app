import React from 'react';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { SelectNative } from '@deriv/components';
import { TSymbol } from 'Components/dashboard/quick-strategy/quick-strategy.types';

const useMarketInput = () => {
    const { active_symbols } = ApiHelpers.instance;
    const symbols = active_symbols.getAllSymbols(/* should_be_open */ true);
    const [value, setValue] = React.useState('');

    const symbol_options = symbols
        .filter((symbol: TSymbol) => {
            const crash_index = symbol.submarket === 'crash_index';
            const non_stable_coin = symbol.submarket === 'non_stable_coin';
            const should_not_show = ['1HZ250V', '1HZ150V'].includes(symbol.symbol);
            return !(crash_index || non_stable_coin || should_not_show);
        })
        .map((symbol: TSymbol) => ({
            group: symbol.submarket_display,
            text: symbol.symbol_display,
            value: symbol.symbol,
        }));

    const get_value = () => value;
    const reset_value = () => setValue('');

    return [
        <>
            <SelectNative
                list_items={symbol_options}
                value={value}
                should_show_empty_option={false}
                onChange={e => setValue(e.target.value)}
                label={'Asset'}
            />
        </>,
        get_value,
        reset_value,
    ];
};

export default useMarketInput;

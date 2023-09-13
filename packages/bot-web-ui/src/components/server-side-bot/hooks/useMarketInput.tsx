import React from 'react';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { SelectNative } from '@deriv/components';
import { TSymbol } from 'Components/dashboard/quick-strategy/quick-strategy.types';

type TUseMarketInput = {
    dispatch: React.Dispatch<any>;
    name?: string;
};

const useMarketInput = ({ dispatch, name = 'symbol' }: TUseMarketInput) => {
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

    const onChange = e => {
        const { value } = e.target;
        setValue(value);
        dispatch({ name, value });
    };

    const reset_value = () => setValue('');

    return [
        <>
            <SelectNative
                list_items={symbol_options}
                value={value}
                should_show_empty_option={false}
                onChange={onChange}
                label={'Asset'}
            />
        </>,
        reset_value,
    ];
};

export default useMarketInput;

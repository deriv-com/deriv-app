import { useState, useEffect, useCallback, useRef } from 'react';
import { WS, pickDefaultSymbol } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { ActiveSymbols } from '@deriv/api-types';
import { useTraderStore } from 'Stores/useTraderStores';
import { usePrevious } from '@deriv/components';

type TUseActiveSymbols = {
    contract_type?: string[];
    barrier_category?: string[];
};
//TODO: contract_type and barrier_category need to come from trade-store after calling contracts_for
const useActiveSymbols = ({ contract_type = [], barrier_category = [] }: TUseActiveSymbols) => {
    const [activeSymbols, setActiveSymbols] = useState<ActiveSymbols | []>([]);
    const { client, modules } = useStore();
    const { is_logged_in } = client;

    const trader = useTraderStore();

    const default_symbol_ref = useRef<string>('');
    const previous_logged_in = usePrevious(is_logged_in);

    const fetchActiveSymbols = useCallback(async () => {
        let response;

        const request = {
            active_symbols: 'brief',
            contract_type,
            barrier_category,
        };

        if (is_logged_in) {
            response = await WS.authorized.activeSymbols(request);
        } else {
            response = await WS.activeSymbols(request);
        }

        const { active_symbols, error } = response;

        trader.active_symbols = active_symbols;

        if (!active_symbols?.length || error) {
            setActiveSymbols([]);
        } else {
            setActiveSymbols(active_symbols);
            default_symbol_ref.current = trader.symbol || (await pickDefaultSymbol(active_symbols)) || '1HZ100V';
            modules.trade.onChange({ target: { name: 'symbol', value: default_symbol_ref.current } });
        }
    }, [is_logged_in, trader, contract_type, barrier_category]);

    useEffect(() => {
        const is_logged_in_changed = previous_logged_in != undefined && previous_logged_in != is_logged_in;
        if (trader.active_symbols?.length && !is_logged_in_changed) {
            setActiveSymbols(trader.active_symbols);
        } else {
            fetchActiveSymbols();
        }
    }, [fetchActiveSymbols, is_logged_in, previous_logged_in, trader]);

    return { default_symbol: default_symbol_ref.current, activeSymbols, fetchActiveSymbols };
};

export default useActiveSymbols;

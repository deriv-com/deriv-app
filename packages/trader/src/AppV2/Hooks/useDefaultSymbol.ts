import { useCallback, useEffect, useRef, useState } from 'react';
import { pickDefaultSymbol, setTradeURLParams } from '@deriv/shared';
import { ActiveSymbols } from '@deriv/api-types';
import useActiveSymbols from './useActiveSymbols';
import { useTraderStore } from 'Stores/useTraderStores';

// The hook handles the cases when the selected `contract_type` is changed during account switch or if the symbol is not available in the URL param.
const useDefaultSymbol = () => {
    const { processContractsForV2, onChange, symbol: symbol_from_store } = useTraderStore();
    const { activeSymbols: active_symbols } = useActiveSymbols();
    const has_initialized_ref = useRef(false);
    const [symbol, setSymbol] = useState('');

    const isSymbolAvailable = useCallback(
        (active_symbols: ActiveSymbols) => {
            const has_initialized = has_initialized_ref.current;

            return active_symbols.some(symbol_info => {
                const exchange_open_check = has_initialized ? true : symbol_info.exchange_is_open === 1;
                return symbol_info.symbol === symbol_from_store && exchange_open_check;
            });
        },
        [symbol_from_store]
    );

    const processNewSymbol = useCallback(
        async (new_symbol: string) => {
            // To call contracts_for during initialization
            const has_initialized = has_initialized_ref.current;
            const is_initailization = !has_initialized && new_symbol;
            const has_symbol_changed = symbol_from_store != new_symbol && new_symbol;
            setSymbol(new_symbol);

            if (is_initailization || has_symbol_changed) {
                await onChange({ target: { name: 'symbol', value: new_symbol } });
                processContractsForV2();
            }
            setTradeURLParams({ symbol: new_symbol });
        },
        [onChange, processContractsForV2, symbol_from_store]
    );

    useEffect(() => {
        const process = async () => {
            const new_symbol = isSymbolAvailable(active_symbols)
                ? symbol_from_store
                : (await pickDefaultSymbol(active_symbols)) || '1HZ100V';

            processNewSymbol(new_symbol);
            has_initialized_ref.current = true;
        };
        process();
    }, [active_symbols, isSymbolAvailable, processNewSymbol, symbol_from_store]);

    return { symbol };
};

export default useDefaultSymbol;

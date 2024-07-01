import { useState, useEffect, useCallback, useRef } from 'react';
import { WS, pickDefaultSymbol } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { ActiveSymbols } from '@deriv/api-types';

const useActiveSymbols = () => {
    const [activeSymbols, setActiveSymbols] = useState<ActiveSymbols | []>([]);
    const { client } = useStore();
    const { is_logged_in } = client;
    const default_symbol_ref = useRef<string>('');

    const fetchActiveSymbols = useCallback(async () => {
        let response;

        if (is_logged_in) {
            response = await WS.authorized.activeSymbols();
        } else {
            response = await WS.activeSymbols();
        }

        const { active_symbols, error } = response;

        if (!active_symbols.length || error) {
            setActiveSymbols([]);
        } else {
            setActiveSymbols(active_symbols);
            default_symbol_ref.current = (await pickDefaultSymbol(active_symbols)) ?? '';
        }
    }, [is_logged_in]);

    useEffect(() => {
        fetchActiveSymbols();
    }, [fetchActiveSymbols]);

    return { default_symbol: default_symbol_ref.current, activeSymbols, fetchActiveSymbols };
};

export default useActiveSymbols;

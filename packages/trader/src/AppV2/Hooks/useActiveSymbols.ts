import { useState, useEffect, useCallback, useRef } from 'react';
import {
    CONTRACT_TYPES,
    TRADE_TYPES,
    WS,
    getContractTypesConfig,
    isTurbosContract,
    isVanillaContract,
    pickDefaultSymbol,
    setTradeURLParams,
} from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { ActiveSymbols } from '@deriv/api-types';
import { usePrevious } from '@deriv/components';
import { useTraderStore } from 'Stores/useTraderStores';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';

const useActiveSymbols = () => {
    const [activeSymbols, setActiveSymbols] = useState<ActiveSymbols | []>([]);
    const { client, common } = useStore();
    const { is_logged_in } = client;
    const { showError } = common;
    const {
        active_symbols: symbols_from_store,
        contract_type,
        has_symbols_for_v2,
        is_vanilla,
        is_turbos,
        onChange,
        setActiveSymbolsV2,
        symbol,
        is_trade_component_mounted,
    } = useTraderStore();

    const default_symbol_ref = useRef('');
    const previous_logged_in = usePrevious(is_logged_in);
    const previous_contract_type = usePrevious(contract_type);

    const getContractTypesList = () => {
        if (is_turbos) return [CONTRACT_TYPES.TURBOS.LONG, CONTRACT_TYPES.TURBOS.SHORT];
        if (is_vanilla) return [CONTRACT_TYPES.VANILLA.CALL, CONTRACT_TYPES.VANILLA.PUT];
        return getContractTypesConfig()[contract_type]?.trade_types ?? [];
    };

    const fetchActiveSymbols = useCallback(
        async () => {
            let response;

            const trade_types_with_barrier_category = [
                TRADE_TYPES.RISE_FALL,
                TRADE_TYPES.RISE_FALL_EQUAL,
                TRADE_TYPES.HIGH_LOW,
            ] as string[];
            const barrier_category = ContractType.getBarrierCategory(contract_type).barrier_category;

            const request = {
                active_symbols: 'brief',
                contract_type: getContractTypesList(),
                ...(trade_types_with_barrier_category.includes(contract_type) && barrier_category
                    ? { barrier_category: [barrier_category] }
                    : {}),
            };

            if (
                (isVanillaContract(previous_contract_type) && is_vanilla) ||
                (isTurbosContract(previous_contract_type) && is_turbos) ||
                // TODO: remove is_trade_component_mounted from check condition once akmals contracts_for_company changes are merged
                // this will also solve the issue of populating unavailable active_symbols for a given trade_type in assets dropdown
                (getContractTypesList().length === 0 && !is_trade_component_mounted)
            ) {
                return;
            }
            if (is_logged_in) {
                response = await WS.authorized.activeSymbols(request);
            } else {
                response = await WS.activeSymbols(request);
            }

            const { active_symbols = [], error } = response;
            if (error) {
                showError({ message: localize('Trading is unavailable at this time.') });
            } else if (!active_symbols?.length) {
                setActiveSymbols([]);
            } else {
                setActiveSymbols(active_symbols);
                setActiveSymbolsV2(active_symbols);
                default_symbol_ref.current = symbol || (await pickDefaultSymbol(active_symbols)) || '1HZ100V';
                onChange({ target: { name: 'symbol', value: default_symbol_ref.current } });
                setTradeURLParams({ symbol: default_symbol_ref.current, contractType: contract_type });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [contract_type, is_logged_in, is_turbos, is_vanilla, previous_contract_type, symbol]
    );
    useEffect(() => {
        const is_logged_in_changed = previous_logged_in !== undefined && previous_logged_in !== is_logged_in;
        const has_contract_type_changed =
            previous_contract_type && contract_type && previous_contract_type !== contract_type;
        if (!symbols_from_store.length || !has_symbols_for_v2 || is_logged_in_changed || has_contract_type_changed) {
            fetchActiveSymbols();
        } else {
            setActiveSymbols(symbols_from_store);
        }
    }, [
        contract_type,
        fetchActiveSymbols,
        has_symbols_for_v2,
        is_logged_in,
        previous_contract_type,
        previous_logged_in,
        symbols_from_store,
    ]);

    return { default_symbol: default_symbol_ref.current, activeSymbols, fetchActiveSymbols };
};

export default useActiveSymbols;

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    CONTRACT_TYPES,
    TRADE_TYPES,
    getContractTypesConfig,
    isTurbosContract,
    isVanillaContract,
    pickDefaultSymbol,
    setTradeURLParams,
} from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { ActiveSymbols, ActiveSymbolsResponse } from '@deriv/api-types';
import { usePrevious } from '@deriv/components';
import { useTraderStore } from 'Stores/useTraderStores';
import useContractsForCompany from './useContractsForCompany';
import { useDtraderQuery } from './useDtraderQuery';

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

    const { available_contract_types, is_loading_ref: is_contracts_for_company_loading } = useContractsForCompany();

    const default_symbol_ref = useRef('');
    const previous_contract_type = usePrevious(contract_type);
    const prev_loginid = useRef(client.loginid);

    const trade_types_with_barrier_category = [
        TRADE_TYPES.RISE_FALL,
        TRADE_TYPES.RISE_FALL_EQUAL,
        TRADE_TYPES.HIGH_LOW,
    ] as string[];

    const getContractTypesList = () => {
        if (is_turbos) return [CONTRACT_TYPES.TURBOS.LONG, CONTRACT_TYPES.TURBOS.SHORT];
        if (is_vanilla) return [CONTRACT_TYPES.VANILLA.CALL, CONTRACT_TYPES.VANILLA.PUT];
        return getContractTypesConfig()[contract_type]?.trade_types ?? [];
    };

    const { barrier_category } = (available_contract_types?.[contract_type]?.config || {}) as any;

    const isQueryEnabled = useCallback(() => {
        console.log(
            'active symbols query enabled check',
            !available_contract_types,
            is_contracts_for_company_loading.current
        );
        if (!available_contract_types) return false;
        if (is_contracts_for_company_loading.current) return false;
        return true;
    }, [available_contract_types, is_contracts_for_company_loading]);

    const { data: response, refetch } = useDtraderQuery<ActiveSymbolsResponse>(
        'active_symbols',
        {
            active_symbols: 'brief',
            contract_type: getContractTypesList(),
            ...(trade_types_with_barrier_category.includes(contract_type) && barrier_category
                ? { barrier_category: [barrier_category] }
                : {}),
        },
        {
            enabled: isQueryEnabled(),
        }
    );

    const fetchActiveSymbols = useCallback(
        async () => {
            if (!response) return;

            if (
                (isVanillaContract(previous_contract_type) && is_vanilla) ||
                (isTurbosContract(previous_contract_type) && is_turbos) ||
                // TODO: remove is_trade_component_mounted from check condition once akmals contracts_for_company changes are merged
                // this will also solve the issue of populating unavailable active_symbols for a given trade_type in assets dropdown
                (getContractTypesList().length === 0 && !is_trade_component_mounted)
            ) {
                return;
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
        [
            response,
            available_contract_types,
            contract_type,
            is_logged_in,
            is_turbos,
            is_vanilla,
            previous_contract_type,
            symbol,
        ]
    );
    useEffect(() => {
        const has_contract_type_changed =
            previous_contract_type && contract_type && previous_contract_type !== contract_type;
        if (!symbols_from_store.length || !has_symbols_for_v2 || has_contract_type_changed) {
            fetchActiveSymbols();
        } else {
            setActiveSymbols(symbols_from_store);
        }
    }, [
        response,
        available_contract_types,
        contract_type,
        fetchActiveSymbols,
        has_symbols_for_v2,
        is_logged_in,
        previous_contract_type,
        symbols_from_store,
    ]);

    useEffect(() => {
        if (
            isQueryEnabled() &&
            prev_loginid.current &&
            prev_loginid.current !== client.loginid &&
            !client.is_switching
        ) {
            console.log('refetch as');
            setActiveSymbols([]);
            refetch();
        }
    }, [client.loginid, client.is_switching, refetch, isQueryEnabled]);

    return { default_symbol: default_symbol_ref.current, activeSymbols, fetchActiveSymbols };
};

export default useActiveSymbols;

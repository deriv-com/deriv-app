import React from 'react';
import clsx from 'clsx';
import { SegmentedControlSingleChoice } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';
import { isTurbosContract, isVanillaContract, TRADE_TYPES } from '@deriv/shared';

type TTradeTypeTabsProps = {
    is_minimized?: boolean;
} & Pick<ReturnType<typeof useTraderStore>, 'contract_type' | 'onChange'>;

const TradeTypeTabs = ({ contract_type, onChange, is_minimized }: TTradeTypeTabsProps) => {
    const is_turbos = isTurbosContract(contract_type);
    const is_vanilla = isVanillaContract(contract_type);
    const tab_list = [
        { label: 'Up', value: TRADE_TYPES.TURBOS.LONG, is_displayed: is_turbos },
        { label: 'Down', value: TRADE_TYPES.TURBOS.SHORT, is_displayed: is_turbos },
        { label: 'Call', value: TRADE_TYPES.VANILLA.CALL, is_displayed: is_vanilla },
        { label: 'Put', value: TRADE_TYPES.VANILLA.PUT, is_displayed: is_vanilla },
    ];
    const options = tab_list.filter(({ is_displayed }) => is_displayed);
    const selected_item_index = options.findIndex(({ value }) => value === contract_type);
    const handleTabChange = (selected_item_index: number) => {
        onChange({ target: { name: 'contract_type', value: options[selected_item_index].value } });
    };

    if (!is_turbos && !is_vanilla) return null;
    return (
        <SegmentedControlSingleChoice
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
            hasContainerWidth
            onChange={handleTabChange}
            options={options.map(({ label }) => ({ label }))}
            selectedItemIndex={selected_item_index}
        />
    );
};

export default TradeTypeTabs;

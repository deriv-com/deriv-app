import React from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { SegmentedControlSingleChoice } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';
import { getTradeTypeTabsList } from 'AppV2/Utils/trade-params-utils';
import { TTradeParametersProps } from '../trade-parameters';

const TradeTypeTabs = observer(({ is_minimized }: TTradeParametersProps) => {
    const { contract_type, is_market_closed, onChange, trade_type_tab, setTradeTypeTab } = useTraderStore();
    const tab_list = getTradeTypeTabsList(contract_type);
    let initial_index = 0;

    // If the trade type tab is VANILLALONGPUT or TURBOSSHORT, keep the first tab
    if (
        !(
            (trade_type_tab === 'VANILLALONGPUT' && contract_type === 'vanillalongcall') ||
            (trade_type_tab === 'TURBOSSHORT' && contract_type === 'turboslong')
        )
    ) {
        initial_index = tab_list.findIndex(tab =>
            trade_type_tab ? tab.contract_type === trade_type_tab : tab.value === contract_type
        );
    }

    const initial_tab_index = initial_index < 0 ? 0 : initial_index;
    const [tab_index, setTabIndex] = React.useState(initial_tab_index);

    const handleTabChange = (selected_item_index: number) => {
        const { contract_type: type, value: trade_type } = tab_list[selected_item_index] ?? {};
        setTabIndex(selected_item_index);
        setTradeTypeTab(type);
        if (trade_type !== contract_type) {
            onChange({ target: { name: 'contract_type', value: trade_type } });
        }
    };

    React.useEffect(() => {
        setTabIndex(initial_tab_index);
        setTradeTypeTab(tab_list[initial_tab_index]?.contract_type);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab_list, initial_tab_index]);

    if (!tab_list.length) return null;
    return (
        <SegmentedControlSingleChoice
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
            hasContainerWidth
            onChange={handleTabChange}
            options={tab_list.map(({ label }) => ({ disabled: is_market_closed, label }))}
            selectedItemIndex={tab_index}
            key={`${tab_index}${is_market_closed}`}
        />
    );
});

export default TradeTypeTabs;

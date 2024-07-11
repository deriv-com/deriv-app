import React from 'react';
import { Dropdown, Loading } from '@deriv/components';
import { Chip, Text } from '@deriv-com/quill-ui';
import BottomNav from 'AppV2/Components/BottomNav';
import { useTraderStore } from 'Stores/useTraderStores';
import { getAvailableContractTypes } from 'Modules/Trading/Helpers/contract-type';
import { TRADE_TYPES, unsupported_contract_types_list } from '@deriv/shared';
import { observer } from 'mobx-react';
import PurchaseButton from 'AppV2/Components/PurchaseButton';
import TradeParameters from 'AppV2/Components/TradeParameters';

const HEIGHT = {
    ADVANCED_FOOTER: 136,
    BOTTOM_NAV: 56,
    HEADER: 48,
    PADDING: 24,
};

const Trade = observer(() => {
    const { active_symbols, contract_type, contract_types_list, onMount, onChange, onUnmount, symbol } =
        useTraderStore();
    const filtered_contract_types = getAvailableContractTypes(
        contract_types_list as unknown as Parameters<typeof getAvailableContractTypes>[0],
        unsupported_contract_types_list
    );
    const symbols = active_symbols.map(({ display_name, symbol: underlying }) => ({
        text: display_name,
        value: underlying,
    }));
    const trade_types = Object.values(filtered_contract_types)
        .map(({ contract_types }) => contract_types)
        .flat()
        .filter(
            ({ value }) =>
                ![TRADE_TYPES.VANILLA.PUT, TRADE_TYPES.TURBOS.SHORT, TRADE_TYPES.RISE_FALL_EQUAL].includes(value)
        );
    const calculated_chart_height =
        window.innerHeight - HEIGHT.HEADER - HEIGHT.BOTTOM_NAV - HEIGHT.ADVANCED_FOOTER - HEIGHT.PADDING;

    React.useEffect(() => {
        onMount();
        return onUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onTradeTypeSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
        const value = trade_types.find(({ text }) => text === (e.target as HTMLButtonElement).textContent)?.value;
        onChange({
            target: {
                name: 'contract_type',
                value,
            },
        });
    };

    return (
        <BottomNav>
            {symbols.length && trade_types.length ? (
                <div className='trade'>
                    <div className='trade__trade-types'>
                        {trade_types.map(({ text, value }) => (
                            <Chip.Selectable
                                key={value}
                                onChipSelect={onTradeTypeSelect}
                                selected={value === contract_type}
                            >
                                <Text size='sm'>{text}</Text>
                            </Chip.Selectable>
                        ))}
                    </div>
                    <div className='trade__assets'>
                        <Dropdown list={symbols} name='symbol' onChange={onChange} value={symbol} />
                    </div>
                    <div className='section__wrapper'>
                        <TradeParameters />
                        <section className='section__chart' style={{ height: calculated_chart_height }}>
                            Awesome Chart Placeholder
                        </section>
                    </div>
                    <TradeParameters is_minimized />
                    <PurchaseButton />
                </div>
            ) : (
                <Loading.DTraderV2 />
            )}
        </BottomNav>
    );
});

export default Trade;

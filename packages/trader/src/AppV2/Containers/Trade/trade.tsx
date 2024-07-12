import React from 'react';
import { observer } from 'mobx-react';
import { Dropdown, Loading } from '@deriv/components';
import { Chip, Text } from '@deriv-com/quill-ui';
import { getAvailableContractTypes } from 'Modules/Trading/Helpers/contract-type';
import { TRADE_TYPES, unsupported_contract_types_list } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import BottomNav from 'AppV2/Components/BottomNav';
import PurchaseButton from 'AppV2/Components/PurchaseButton';
import { HEIGHT } from 'AppV2/Utils/layout-utils';
import { TradeParametersContainer, TradeParametersList } from 'AppV2/Components/TradeParameters';

const Trade = observer(() => {
    const chart_ref = React.useRef<HTMLDivElement>(null);

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

    const onTradeTypeSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
        const value = trade_types.find(({ text }) => text === (e.target as HTMLButtonElement).textContent)?.value;
        onChange({
            target: {
                name: 'contract_type',
                value,
            },
        });
    };

    React.useEffect(() => {
        onMount();
        return onUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BottomNav>
            {symbols.length && trade_types.length ? (
                <React.Fragment>
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
                    <div className='trade__section__wrapper'>
                        <TradeParametersContainer>
                            <TradeParametersList />
                        </TradeParametersContainer>
                        <section className='trade__chart' style={{ height: calculated_chart_height }} ref={chart_ref}>
                            Awesome Chart Placeholder
                        </section>
                    </div>
                    <TradeParametersContainer chart_ref={chart_ref} is_minimized>
                        <TradeParametersList is_minimized />
                    </TradeParametersContainer>
                    <PurchaseButton />
                </React.Fragment>
            ) : (
                <Loading.DTraderV2 />
            )}
        </BottomNav>
    );
});

export default Trade;

import React from 'react';
import { Dropdown, Loading } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { Chip, Text } from '@deriv-com/quill-ui';
import BottomNav from 'AppV2/Components/BottomNav';
import { useTraderStore } from 'Stores/useTraderStores';
import { getAvailableContractTypes } from 'Modules/Trading/Helpers/contract-type';
import { TRADE_TYPES, unsupported_contract_types_list } from '@deriv/shared';
import { observer } from 'mobx-react';
import Guide from 'AppV2/Components/Guide';
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
    const chart_ref = React.useRef<HTMLDivElement>(null);
    const mock_trade_params = [
        { label: <Localize i18n_default_text='Duration' />, value: localize('1 minute') },
        { label: <Localize i18n_default_text='Stake' />, value: '10.00 USD' },
        { label: <Localize i18n_default_text='Allow equals' />, value: '-' },
    ];

    React.useEffect(() => {
        onMount();
        if (chart_ref.current) {
            const calculated_height =
                window.innerHeight - HEIGHT.HEADER - HEIGHT.BOTTOM_NAV - HEIGHT.ADVANCED_FOOTER - HEIGHT.PADDING;
            chart_ref.current.style.setProperty('height', `${calculated_height}px`);
        }
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
                    <div className='section__wrapper'>
                        <TradeParameters trade_parameters_list={mock_trade_params} />
                        <section className='section__chart' ref={chart_ref}>
                            Awesome Chart Placeholder
                        </section>
                    </div>
                    <TradeParameters trade_parameters_list={mock_trade_params} is_minimized />
                    <PurchaseButton />
                    <Guide has_label />
                    <Guide />
                </React.Fragment>
            ) : (
                <Loading.DTraderV2 />
            )}
        </BottomNav>
    );
});

export default Trade;

import React from 'react';
import { observer } from 'mobx-react';
import { Loading } from '@deriv/components';
import { useTraderStore } from 'Stores/useTraderStores';
import BottomNav from 'AppV2/Components/BottomNav';
import PurchaseButton from 'AppV2/Components/PurchaseButton';
import { HEIGHT } from 'AppV2/Utils/layout-utils';
import { getTradeTypesList } from 'AppV2/Utils/trade-types-utils';
import { TradeParametersContainer, TradeParameters } from 'AppV2/Components/TradeParameters';
import CurrentSpot from 'AppV2/Components/CurrentSpot';
import { TradeChart } from '../Chart';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import TemporaryTradeTypes from './trade-types';
import TemporaryAssets from './assets';

const Trade = observer(() => {
    const chart_ref = React.useRef<HTMLDivElement>(null);

    const { active_symbols, contract_type, contract_types_list, onMount, onChange, onUnmount, symbol } =
        useTraderStore();

    const trade_types = React.useMemo(() => getTradeTypesList(contract_types_list), [contract_types_list]);
    const symbols = React.useMemo(
        () =>
            active_symbols.map(({ display_name, symbol: underlying }) => ({
                text: display_name,
                value: underlying,
            })),
        [active_symbols]
    );

    const dynamic_chart_height =
        window.innerHeight - HEIGHT.HEADER - HEIGHT.BOTTOM_NAV - HEIGHT.ADVANCED_FOOTER - HEIGHT.PADDING;

    const onTradeTypeSelect = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const value = trade_types.find(({ text }) => text === (e.target as HTMLButtonElement).textContent)?.value;
            onChange({
                target: {
                    name: 'contract_type',
                    value,
                },
            });
        },
        [trade_types, onChange]
    );

    React.useEffect(() => {
        onMount();
        return onUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BottomNav>
            {symbols.length && trade_types.length ? (
                <div className='trade'>
                    <TemporaryTradeTypes
                        contract_type={contract_type}
                        onTradeTypeSelect={onTradeTypeSelect}
                        trade_types={trade_types}
                    />
                    <TemporaryAssets onChange={onChange} symbol={symbol} symbols={symbols} />
                    {isDigitTradeType(contract_type) && <CurrentSpot />}
                    <div className='trade__section__wrapper'>
                        <TradeParametersContainer>
                            <TradeParameters />
                        </TradeParametersContainer>
                        <section className='trade__chart' style={{ height: dynamic_chart_height }} ref={chart_ref}>
                            <TradeChart />
                        </section>
                    </div>
                    <TradeParametersContainer chart_ref={chart_ref} is_minimized>
                        <TradeParameters is_minimized />
                    </TradeParametersContainer>
                    <PurchaseButton />
                </div>
            ) : (
                <Loading.DTraderV2 />
            )}
        </BottomNav>
    );
});

export default Trade;

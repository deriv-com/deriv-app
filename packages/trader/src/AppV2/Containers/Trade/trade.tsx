import React from 'react';
import { observer } from 'mobx-react';
import { Loading } from '@deriv/components';
import ClosedMarketMessage from 'AppV2/Components/ClosedMarketMessage';
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
import MarketSelector from 'AppV2/Components/MarketSelector';
import AccumulatorStats from 'AppV2/Components/Stats';

const Trade = observer(() => {
    const [is_minimized_params_visible, setIsMinimizedParamsVisible] = React.useState(false);
    const chart_ref = React.useRef<HTMLDivElement>(null);

    const { active_symbols, contract_type, contract_types_list, onMount, onChange, onUnmount } = useTraderStore();

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

    const onScroll = React.useCallback(() => {
        const current_chart_ref = chart_ref?.current;
        if (current_chart_ref) {
            const chart_bottom_Y = current_chart_ref.getBoundingClientRect().bottom;
            const container_bottom_Y = window.innerHeight - HEIGHT.BOTTOM_NAV;
            setIsMinimizedParamsVisible(chart_bottom_Y < container_bottom_Y);
        }
    }, []);

    React.useEffect(() => {
        onMount();
        return onUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BottomNav onScroll={onScroll}>
            {symbols.length && trade_types.length ? (
                <React.Fragment>
                    <div className='trade'>
                        <TemporaryTradeTypes
                            contract_type={contract_type}
                            onTradeTypeSelect={onTradeTypeSelect}
                            trade_types={trade_types}
                        />
                        <MarketSelector />
                        {isDigitTradeType(contract_type) && <CurrentSpot />}
                        <TradeParametersContainer>
                            <TradeParameters />
                        </TradeParametersContainer>
                        <section className='trade__chart' style={{ height: dynamic_chart_height }} ref={chart_ref}>
                            <TradeChart />
                        </section>
                        <AccumulatorStats />
                    </div>
                    <TradeParametersContainer is_minimized_visible={is_minimized_params_visible} is_minimized>
                        <TradeParameters is_minimized />
                    </TradeParametersContainer>
                    <PurchaseButton />
                </React.Fragment>
            ) : (
                <Loading.DTraderV2 />
            )}
            <ClosedMarketMessage />
        </BottomNav>
    );
});

export default Trade;

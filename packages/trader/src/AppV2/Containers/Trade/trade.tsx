import React, { useEffect } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Loading } from '@deriv/components';
import { useLocalStorageData } from '@deriv/hooks';
import { useStore } from '@deriv/stores';

import AccumulatorStats from 'AppV2/Components/AccumulatorStats';
import BottomNav from 'AppV2/Components/BottomNav';
import ClosedMarketMessage from 'AppV2/Components/ClosedMarketMessage';
import CurrentSpot from 'AppV2/Components/CurrentSpot';
import MarketSelector from 'AppV2/Components/MarketSelector';
import OnboardingGuide from 'AppV2/Components/OnboardingGuide/GuideForPages';
import PurchaseButton from 'AppV2/Components/PurchaseButton';
import ServiceErrorSheet from 'AppV2/Components/ServiceErrorSheet';
import TradeErrorSnackbar from 'AppV2/Components/TradeErrorSnackbar';
import { TradeParameters, TradeParametersContainer } from 'AppV2/Components/TradeParameters';
import useContractsForCompany from 'AppV2/Hooks/useContractsForCompany';
import { getChartHeight, HEIGHT } from 'AppV2/Utils/layout-utils';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import { useTraderStore } from 'Stores/useTraderStores';

import { sendSelectedTradeTypeToAnalytics } from '../../../Analytics';
import { TradeChart } from '../Chart';

import TradeTypes from './trade-types';

const Trade = observer(() => {
    const [is_minimized_params_visible, setIsMinimizedParamsVisible] = React.useState(false);
    const chart_ref = React.useRef<HTMLDivElement>(null);
    const {
        client: { is_logged_in, is_switching },
        common: { current_language },
        ui: { is_dark_mode_on },
    } = useStore();
    const {
        active_symbols,
        contract_type,
        has_cancellation,
        is_accumulator,
        is_market_closed,
        onChange,
        onMount,
        onUnmount,
        symbol,
    } = useTraderStore();
    const { trade_types, resetTradeTypes } = useContractsForCompany();
    const [guide_dtrader_v2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
    });

    const symbols = React.useMemo(
        () =>
            active_symbols.map(({ display_name, symbol: underlying }) => ({
                text: display_name,
                value: underlying,
            })),
        [active_symbols]
    );

    const onTradeTypeSelect = React.useCallback(
        (
            e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
            subform_name: string,
            trade_type_count: number
        ) => {
            const value = trade_types.find(({ text }) => text === (e.target as HTMLButtonElement).textContent)?.value;
            onChange({
                target: {
                    name: 'contract_type',
                    value,
                },
            });
            sendSelectedTradeTypeToAnalytics(value || '', subform_name, symbol, trade_type_count);
        },
        [trade_types, onChange, symbol]
    );

    const onScroll = React.useCallback(() => {
        const current_chart_ref = chart_ref?.current;
        if (current_chart_ref) {
            const chart_bottom_Y = current_chart_ref.getBoundingClientRect().bottom;
            const container_bottom_Y = window.innerHeight - HEIGHT.BOTTOM_NAV;
            setIsMinimizedParamsVisible(chart_bottom_Y <= container_bottom_Y);
        }
    }, []);

    React.useEffect(() => {
        onMount();
        return onUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current_language]);

    useEffect(() => {
        if (is_switching) {
            resetTradeTypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    return (
        <BottomNav onScroll={onScroll}>
            {symbols.length && trade_types.length && !is_switching ? (
                <React.Fragment>
                    <div className='trade'>
                        <TradeTypes
                            contract_type={contract_type}
                            onTradeTypeSelect={onTradeTypeSelect}
                            trade_types={trade_types}
                            is_dark_mode_on={is_dark_mode_on}
                        />
                        <MarketSelector />
                        {isDigitTradeType(contract_type) && <CurrentSpot />}
                        <TradeParametersContainer>
                            <TradeParameters />
                        </TradeParametersContainer>
                        <div className='trade__chart-tooltip'>
                            <section
                                className={clsx('trade__chart', { 'trade__chart--with-borderRadius': !is_accumulator })}
                                style={{
                                    height: getChartHeight({ is_accumulator, symbol, has_cancellation, contract_type }),
                                }}
                                ref={chart_ref}
                            >
                                <TradeChart />
                            </section>
                        </div>
                        {is_accumulator && <AccumulatorStats />}
                    </div>
                    <div className={clsx('trade__parameter', { 'trade__parameter--with-button': !is_market_closed })}>
                        <TradeParametersContainer is_minimized_visible={is_minimized_params_visible} is_minimized>
                            <TradeParameters is_minimized />
                        </TradeParametersContainer>
                        {!is_market_closed && <PurchaseButton />}
                    </div>
                    {!guide_dtrader_v2?.trade_page && is_logged_in && (
                        <OnboardingGuide type='trade_page' is_dark_mode_on={is_dark_mode_on} />
                    )}
                </React.Fragment>
            ) : (
                <Loading.DTraderV2 />
            )}
            <ServiceErrorSheet />
            <ClosedMarketMessage />
            <TradeErrorSnackbar error_fields={['stop_loss', 'take_profit', 'date_start']} should_show_snackbar />
        </BottomNav>
    );
});

export default Trade;

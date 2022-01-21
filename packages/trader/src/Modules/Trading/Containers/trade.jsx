import React from 'react';
import PropTypes from 'prop-types';
import { DesktopWrapper } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { connect } from 'Stores/connect';
import PositionsDrawer from 'App/Components/Elements/PositionsDrawer';
import MarketIsClosedOverlay from 'App/Components/Elements/market-is-closed-overlay.jsx';
import FormLayout from '../Components/Form/form-layout.jsx';
import AllMarkers from '../../SmartChart/Components/all-markers.jsx';

const BottomWidgetsMobile = ({ tick, digits, setTick, setDigits }) => {
    React.useEffect(() => {
        setTick(tick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick]);

    React.useEffect(() => {
        setDigits(digits);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [digits]);

    // render nothing for bottom widgets on chart in mobile
    return null;
};

const Trade = ({
    contract_type,
    form_components,
    getFirstOpenMarket,
    should_show_active_symbols_loading,
    is_chart_loading,
    is_dark_theme,
    is_eu,
    is_market_closed,
    is_market_unavailable_visible,
    is_trade_enabled,
    network_status,
    NotificationMessages,
    onChange,
    onMount,
    onUnmount,
    prepareTradeStore,
    setContractTypes,
    setMobileDigitView,
    show_digits_stats,
    should_show_multipliers_onboarding,
    symbol,
    is_synthetics_available,
}) => {
    const [digits, setDigits] = React.useState([]);
    const [tick, setTick] = React.useState({});
    const [try_synthetic_indices, setTrySyntheticIndices] = React.useState(false);
    const [try_open_markets, setTryOpenMarkets] = React.useState(false);
    const [category, setCategory] = React.useState(null);
    const [subcategory, setSubcategory] = React.useState(null);
    const [is_digits_widget_active, setIsDigitsWidgetActive] = React.useState(false);

    const open_market = React.useMemo(() => {
        if (try_synthetic_indices) {
            return { category: 'synthetic_index' };
        } else if (try_open_markets && category) {
            return { category, subcategory };
        }
        return null;
    }, [try_synthetic_indices, try_open_markets, category, subcategory]);

    React.useEffect(() => {
        onMount();
        if (!is_synthetics_available) {
            const setMarket = async () => {
                const markets_to_search = ['forex', 'indices', 'commodities']; // none-synthetic
                const { category: market_cat, subcategory: market_subcat } =
                    (await getFirstOpenMarket(markets_to_search)) ?? {};
                if (market_cat) {
                    setCategory(market_cat);
                    setSubcategory(market_subcat);
                }
            };

            setMarket();
        }
        return () => onUnmount();
    }, [onMount, onUnmount]);

    React.useEffect(() => {
        if (isMobile()) {
            setDigits([]);
        }
        setTrySyntheticIndices(false);
        setTryOpenMarkets(false);
    }, [symbol, setDigits, setTrySyntheticIndices]);

    React.useEffect(() => {
        const selectMultipliers = async () => {
            await setContractTypes();

            onChange({ target: { name: 'contract_type', value: 'multiplier' } });
        };
        if (should_show_multipliers_onboarding && !is_chart_loading && (is_synthetics_available || !is_market_closed)) {
            selectMultipliers();
        }
    }, [should_show_multipliers_onboarding, is_chart_loading]);

    const onTryOtherMarkets = async () => {
        if (!is_synthetics_available) {
            setTryOpenMarkets(true);
            setTimeout(() => setTryOpenMarkets(false));
        } else {
            setTrySyntheticIndices(true);
            setTimeout(() => setTrySyntheticIndices(false));
        }
    };

    const form_wrapper_class = isMobile() ? 'mobile-wrapper' : 'sidebar__container desktop-only';

    return (
        <div id='trade_container' className='trade-container'>
            <DesktopWrapper>
                <PositionsDrawer />
            </DesktopWrapper>
            {/* Div100vhContainer is workaround for browsers on devices
                    with toolbars covering screen height,
                    using css vh is not returning correct screen height */}
            {/* <Div100vhContainer
                id='chart_container'
                className='chart-container'
                is_disabled={isDesktop()}
                height_offset='259px'
            >
                <NotificationMessages />
                <React.Suspense
                    fallback={<ChartLoader is_dark={is_dark_theme} is_visible={!symbol || is_chart_loading} />}
                >
                    <DesktopWrapper>
                        <div className='chart-container__wrapper'>
                            <ChartLoader is_visible={is_chart_loading || should_show_active_symbols_loading} />
                            <ChartTrade
                                try_synthetic_indices={try_synthetic_indices}
                                try_open_markets={try_open_markets}
                                open_market={open_market}
                            />
                        </div>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <ChartLoader
                            is_visible={
                                is_chart_loading ||
                                should_show_active_symbols_loading ||
                                (isDigitTradeType(contract_type) && !digits[0])
                            }
                        />
                        <SwipeableWrapper
                            onChange={onChangeSwipeableIndex}
                            is_disabled={
                                !show_digits_stats ||
                                !is_trade_enabled ||
                                form_components.length === 0 ||
                                is_chart_loading ||
                                should_show_active_symbols_loading
                            }
                        >
                            {show_digits_stats && <DigitsWidget digits={digits} tick={tick} />}
                            <ChartTrade
                                bottomWidgets={show_digits_stats ? bottomWidgets : undefined}
                                is_digits_widget_active={show_digits_stats ? is_digits_widget_active : undefined}
                                try_synthetic_indices={try_synthetic_indices}
                                try_open_markets={try_open_markets}
                                open_market={open_market}
                            />
                        </SwipeableWrapper>
                    </MobileWrapper>
                </React.Suspense>
                <Test />
            </Div100vhContainer> */}
            <div className={form_wrapper_class}>
                {is_market_closed && !is_market_unavailable_visible && (
                    <MarketIsClosedOverlay
                        is_eu={is_eu}
                        is_synthetics_available={is_synthetics_available}
                        {...(is_eu && category && { is_market_available: true })}
                        onClick={onTryOtherMarkets}
                        onMarketOpen={prepareTradeStore}
                        symbol={symbol}
                    />
                )}
                <FormLayout
                    is_market_closed={is_market_closed}
                    is_trade_enabled={
                        is_trade_enabled && form_components.length > 0 && network_status.class === 'online'
                    }
                />
            </div>
        </div>
    );
};

export default connect(({ client, common, modules, ui }) => ({
    getFirstOpenMarket: modules.trade.getFirstOpenMarket,
    is_eu: client.is_eu,
    is_synthetics_available: modules.trade.is_synthetics_available,
    network_status: common.network_status,
    contract_type: modules.trade.contract_type,
    form_components: modules.trade.form_components,
    should_show_active_symbols_loading: modules.trade.should_show_active_symbols_loading,
    is_chart_loading: modules.trade.is_chart_loading,
    is_market_closed: modules.trade.is_market_closed,
    show_digits_stats: modules.trade.show_digits_stats,
    is_trade_enabled: modules.trade.is_trade_enabled,
    prepareTradeStore: modules.trade.prepareTradeStore,
    setMobileDigitView: modules.trade.setMobileDigitView,
    symbol: modules.trade.symbol,
    onMount: modules.trade.onMount,
    onUnmount: modules.trade.onUnmount,
    purchase_info: modules.trade.purchase_info,
    NotificationMessages: ui.notification_messages_ui,
    is_market_unavailable_visible: ui.has_only_forward_starting_contracts,
    should_show_multipliers_onboarding: ui.should_show_multipliers_onboarding,
    onChange: modules.trade.onChange,
    setContractTypes: modules.trade.setContractTypes,
}))(Trade);

// CHART (ChartTrade)--------------------------------------------------------

/* eslint-disable */
import { SmartChart } from 'Modules/SmartChart';

const SmartChartWithRef = React.forwardRef((props, ref) => <SmartChart innerRef={ref} {...props} />);

// ChartMarkers --------------------------
const Markers = ({ markers_array, is_dark_theme, granularity, currency, config }) =>
    markers_array.map(marker => {
        const Marker = AllMarkers[marker.type];
        return (
            <Marker
                key={marker.key}
                is_dark_theme={is_dark_theme}
                granularity={granularity}
                currency={currency}
                config={config}
                {...marker}
            />
        );
    });

const ChartMarkers = connect(({ modules, ui, client }) => ({
    markers_array: modules.contract_trade.markers_array,
    is_digit_contract: modules.contract_trade.is_digit_contract,
    granularity: modules.contract_trade.granularity,
    is_dark_theme: ui.is_dark_mode_on,
    currency: client.currency,
}))(Markers);

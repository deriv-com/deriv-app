import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    DesktopWrapper,
    Div100vhContainer,
    MobileWrapper,
    PageOverlay,
    SwipeableWrapper,
    FadeWrapper,
    usePrevious,
} from '@deriv/components';
import {
    getDurationPeriod,
    getDurationUnitText,
    getPlatformRedirect,
    isAccumulatorContract,
    isDesktop,
    isEmptyObject,
    isMobile,
    isMultiplierContract,
    isVanillaContract,
    urlFor,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import ChartLoader from 'App/Components/Elements/chart-loader.jsx';
import ContractDrawer from 'App/Components/Elements/ContractDrawer';
import UnsupportedContractModal from 'App/Components/Elements/Modals/UnsupportedContractModal';
import { SmartChart } from 'Modules/SmartChart';
import { ChartBottomWidgets, ChartTopWidgets, DigitsWidget, InfoBoxWidget } from './contract-replay-widget.jsx';
import ChartMarker from 'Modules/SmartChart/Components/Markers/marker.jsx';
import allMarkers from 'Modules/SmartChart/Components/all-markers.jsx';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const ContractReplay = observer(({ contract_id }) => {
    const { common, contract_replay, ui } = useStore();
    const { contract_store } = contract_replay;
    const {
        is_market_closed,
        is_sell_requested,
        is_valid_to_cancel,
        onClickCancel,
        onClickSell,
        onMount,
        onUnmount,
        indicative_status,
        is_chart_loading,
        is_forward_starting,
    } = contract_replay;
    const { contract_info, contract_update, contract_update_history, is_digit_contract } = contract_store;
    const { routeBackInApp } = common;
    const { is_dark_mode_on: is_dark_theme, notification_messages_ui: NotificationMessages, toggleHistoryTab } = ui;

    const [is_visible, setIsVisible] = React.useState(false);
    const history = useHistory();

    React.useEffect(() => {
        const url_contract_id = +/[^/]*$/.exec(location.pathname)[0];
        onMount(contract_id || url_contract_id);
        setIsVisible(true);

        return () => {
            setIsVisible(false);
            onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract_id, location, onMount, onUnmount]);

    const onClickClose = () => {
        setIsVisible(false);
        const is_from_table_row = !isEmptyObject(location.state) ? location.state.from_table_row : false;
        return is_from_table_row ? history.goBack() : routeBackInApp(history);
    };

    if (!contract_info.underlying) return null;

    const is_accumulator = isAccumulatorContract(contract_info.contract_type);
    const is_multiplier = isMultiplierContract(contract_info.contract_type);
    const is_vanilla = isVanillaContract(contract_info.contract_type);

    const contract_drawer_el = (
        <ContractDrawer
            contract_info={contract_info}
            contract_update={contract_update}
            contract_update_history={contract_update_history}
            is_accumulator={is_accumulator}
            is_chart_loading={is_chart_loading}
            is_dark_theme={is_dark_theme}
            is_market_closed={is_market_closed}
            is_multiplier={is_multiplier}
            is_sell_requested={is_sell_requested}
            is_valid_to_cancel={is_valid_to_cancel}
            is_vanilla={is_vanilla}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            status={indicative_status}
            toggleHistoryTab={toggleHistoryTab}
        />
    );

    const unsupportedContractOnConfirm = () => {
        history.goBack();
    };

    const unsupportedContractOnClose = () => {
        const statementws_url = urlFor('user/statementws', { legacy: true });
        window.open(statementws_url, '_blank');
    };

    return (
        <FadeWrapper is_visible={is_visible} className='contract-details-wrapper' keyname='contract-details-wrapper'>
            <MobileWrapper>
                <NotificationMessages />
            </MobileWrapper>
            <UnsupportedContractModal
                onConfirm={unsupportedContractOnConfirm}
                onClose={unsupportedContractOnClose}
                is_visible={is_forward_starting}
            />
            <PageOverlay
                id='dt_contract_replay_container'
                header={localize('Contract details')}
                onClickClose={onClickClose}
            >
                <Div100vhContainer
                    className='trade-container__replay'
                    is_disabled={isDesktop()}
                    height_offset='80px' // * 80px = header + contract details header heights in mobile
                >
                    <DesktopWrapper>{contract_drawer_el}</DesktopWrapper>
                    <MobileWrapper>
                        <div
                            className={classNames('contract-drawer__mobile-wrapper', {
                                'contract-drawer__mobile-wrapper--is-multiplier': isMobile() && is_multiplier,
                            })}
                        >
                            {contract_drawer_el}
                        </div>
                    </MobileWrapper>
                    <React.Suspense fallback={<div />}>
                        <div
                            className={classNames('replay-chart__container', {
                                'replay-chart__container--is-multiplier': isMobile() && is_multiplier,
                                'vanilla-trade-chart': is_vanilla,
                            })}
                        >
                            <DesktopWrapper>
                                <NotificationMessages />
                            </DesktopWrapper>
                            <ChartLoader is_dark={is_dark_theme} is_visible={is_chart_loading} />
                            <DesktopWrapper>
                                <ReplayChart is_dark_theme={is_dark_theme} is_accumulator_contract={is_accumulator} />
                            </DesktopWrapper>
                            <MobileWrapper>
                                {is_digit_contract ? (
                                    <React.Fragment>
                                        <InfoBoxWidget />
                                        <SwipeableWrapper className='replay-chart__container-swipeable-wrapper'>
                                            <DigitsWidget />
                                            <ReplayChart />
                                        </SwipeableWrapper>
                                    </React.Fragment>
                                ) : (
                                    <ReplayChart
                                        is_dark_theme={is_dark_theme}
                                        is_accumulator_contract={is_accumulator}
                                    />
                                )}
                            </MobileWrapper>
                        </div>
                    </React.Suspense>
                </Div100vhContainer>
            </PageOverlay>
        </FadeWrapper>
    );
});

ContractReplay.propTypes = {
    contract_id: PropTypes.number,
};

export default ContractReplay;

// CHART -----------------------------------------

const ReplayChart = observer(({ is_accumulator_contract }) => {
    const trade = useTraderStore();
    const { contract_replay, common, ui } = useStore();
    const { contract_store, chart_state, chartStateChange, margin } = contract_replay;
    const {
        contract_config,
        marker: accumulators_barriers_marker,
        is_digit_contract,
        barriers_array,
        markers_array,
        contract_info,
    } = contract_store;
    const { underlying: symbol, audit_details } = contract_info;
    const allow_scroll_to_epoch = chart_state === 'READY' || chart_state === 'SCROLL_TO_LEFT';
    const { app_routing_history, current_language, is_socket_opened } = common;
    const { is_dark_mode_on: is_dark_theme, is_chart_layout_default, is_chart_countdown_visible } = ui;
    const { end_epoch, chart_type, start_epoch, granularity } = contract_config;
    /**
     * TODO: remove forcing light theme once DBot supports dark theme
     * DBot does not support for dark theme since till now,
     * as a result, if any user come to report detail pages
     * from DBot, we should force it to have light theme
     */
    const from_platform = getPlatformRedirect(app_routing_history);
    const should_force_light_theme = from_platform.name === 'DBot';
    const settings = {
        language: current_language.toLowerCase(),
        theme: is_dark_theme && !should_force_light_theme ? 'dark' : 'light',
        position: is_chart_layout_default ? 'bottom' : 'left',
        countdown: is_chart_countdown_visible,
        assetInformation: false, // ui.is_chart_asset_info_visible,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI
    };
    const scroll_to_epoch = allow_scroll_to_epoch ? contract_config.scroll_to_epoch : undefined;
    const all_ticks = audit_details ? audit_details.all_ticks : [];
    const { wsForget, wsSubscribe, wsSendRequest, wsForgetStream } = trade;

    const AccumulatorsShadedBarriers = allMarkers[accumulators_barriers_marker?.type];

    const isBottomWidgetVisible = () => {
        return isDesktop() && is_digit_contract;
    };

    const getChartYAxisMargin = () => {
        const chart_margin = {
            top: isMobile() ? 96 : 148,
            bottom: isBottomWidgetVisible() ? 128 : 112,
        };

        if (isMobile()) {
            chart_margin.bottom = 48;
        }

        return chart_margin;
    };
    const prev_start_epoch = usePrevious(start_epoch);

    return (
        <SmartChart
            barriers={barriers_array}
            bottomWidgets={isBottomWidgetVisible() ? ChartBottomWidgets : null}
            chartControlsWidgets={null}
            chartType={chart_type}
            endEpoch={end_epoch}
            margin={margin || null}
            isMobile={isMobile()}
            enabledNavigationWidget={isDesktop()}
            enabledChartFooter={false}
            granularity={granularity}
            requestAPI={wsSendRequest}
            requestForget={wsForget}
            requestForgetStream={wsForgetStream}
            crosshair={isMobile() ? 0 : undefined}
            maxTick={isMobile() ? 8 : undefined}
            requestSubscribe={wsSubscribe}
            settings={settings}
            startEpoch={start_epoch}
            scrollToEpoch={scroll_to_epoch}
            stateChangeListener={chartStateChange}
            symbol={symbol}
            allTicks={all_ticks}
            topWidgets={ChartTopWidgets}
            isConnectionOpened={is_socket_opened}
            isStaticChart={
                // forcing chart reload when start_epoch changes to an earlier epoch for ACCU closed contract:
                is_accumulator_contract && end_epoch && start_epoch < prev_start_epoch
            }
            shouldFetchTradingTimes={!end_epoch}
            yAxisMargin={getChartYAxisMargin()}
            anchorChartToLeft={isMobile()}
            shouldFetchTickHistory={
                getDurationUnitText(getDurationPeriod(contract_info)) !== 'seconds' || contract_info.status === 'open'
            }
            contractInfo={contract_info}
        >
            {markers_array.map(marker => (
                <ChartMarker
                    key={marker.react_key}
                    marker_config={marker.marker_config}
                    marker_content_props={marker.content_config}
                    is_bottom_widget_visible={isBottomWidgetVisible()}
                />
            ))}
            {is_accumulator_contract && markers_array && (
                <AccumulatorsShadedBarriers
                    key={accumulators_barriers_marker.key}
                    is_dark_theme={is_dark_theme}
                    granularity={granularity}
                    is_in_contract_details
                    {...accumulators_barriers_marker}
                />
            )}
        </SmartChart>
    );
});

ReplayChart.propTypes = {
    is_accumulator_contract: PropTypes.bool,
};

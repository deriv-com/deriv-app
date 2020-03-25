import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { DesktopWrapper, Div100vhContainer, MobileWrapper, PageOverlay, SwipeableWrapper } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared/utils/screen';
import ObjectUtils from '@deriv/shared/utils/object';
import { localize } from '@deriv/translations';
import { FadeWrapper } from 'App/Components/Animations';
import ChartLoader from 'App/Components/Elements/chart-loader.jsx';
import ContractDrawer from 'App/Components/Elements/ContractDrawer';
import { SmartChart } from 'Modules/SmartChart';
import { connect } from 'Stores/connect';
import { ChartBottomWidgets, ChartTopWidgets, DigitsWidget, InfoBoxWidget } from './contract-replay-widget.jsx';
import ChartMarker from '../../SmartChart/Components/Markers/marker.jsx';

class ContractReplay extends React.Component {
    state = {
        is_visible: false,
    };

    componentDidMount() {
        const url_contract_id = +/[^/]*$/.exec(location.pathname)[0];
        this.props.onMount(this.props.contract_id || url_contract_id);
        this.setState({ is_visible: true });
    }

    componentWillUnmount() {
        this.setState({ is_visible: false });
        this.props.onUnmount();
    }

    onClickClose = () => {
        this.setState({ is_visible: false });
        const is_from_table_row = !ObjectUtils.isEmptyObject(this.props.location.state)
            ? this.props.location.state.from_table_row
            : false;
        return is_from_table_row ? this.props.history.goBack() : this.props.routeBackInApp(this.props.history);
    };

    render() {
        const {
            contract_info,
            contract_update_history,
            is_chart_loading,
            is_dark_theme,
            is_digit_contract,
            is_sell_requested,
            is_valid_to_cancel,
            onClickCancel,
            NotificationMessages,
            onClickSell,
            indicative_status,
            toggleHistoryTab,
        } = this.props;

        if (!contract_info.underlying) return null;

        return (
            <FadeWrapper
                is_visible={this.state.is_visible}
                className='contract-details-wrapper'
                keyname='contract-details-wrapper'
            >
                <MobileWrapper>
                    <NotificationMessages />
                </MobileWrapper>
                <PageOverlay
                    id='dt_contract_replay_container'
                    header={localize('Contract details')}
                    onClickClose={this.onClickClose}
                >
                    <Div100vhContainer
                        className='trade-container__replay'
                        is_disabled={isDesktop()}
                        height_offset='80px' // * 80px = header + contract details header heights in mobile
                    >
                        <ContractDrawer
                            contract_info={contract_info}
                            contract_update_history={contract_update_history}
                            is_dark_theme={is_dark_theme}
                            is_sell_requested={is_sell_requested}
                            is_valid_to_cancel={is_valid_to_cancel}
                            onClickCancel={onClickCancel}
                            onClickSell={onClickSell}
                            status={indicative_status}
                            toggleHistoryTab={toggleHistoryTab}
                        />
                        <React.Suspense fallback={<div />}>
                            <div className='replay-chart__container'>
                                <DesktopWrapper>
                                    <NotificationMessages />
                                </DesktopWrapper>
                                <ChartLoader is_dark={is_dark_theme} is_visible={is_chart_loading} />
                                <DesktopWrapper>
                                    <ReplayChart />
                                </DesktopWrapper>
                                <MobileWrapper>
                                    <InfoBoxWidget />
                                    {is_digit_contract ? (
                                        <SwipeableWrapper>
                                            <DigitsWidget />
                                            <ReplayChart />
                                        </SwipeableWrapper>
                                    ) : (
                                        <ReplayChart />
                                    )}
                                </MobileWrapper>
                            </div>
                        </React.Suspense>
                    </Div100vhContainer>
                </PageOverlay>
            </FadeWrapper>
        );
    }
}

ContractReplay.propTypes = {
    contract_id: PropTypes.number,
    contract_info: PropTypes.object,
    history: PropTypes.object,
    indicative_status: PropTypes.string,
    is_chart_loading: PropTypes.bool,
    is_dark_theme: PropTypes.bool,
    is_digit_contract: PropTypes.bool,
    location: PropTypes.object,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    routes: PropTypes.arrayOf(PropTypes.object),
};

export default withRouter(
    connect(({ common, modules, ui }) => {
        const contract_replay = modules.contract_replay;
        const contract_store = contract_replay.contract_store;
        return {
            routeBackInApp: common.routeBackInApp,
            contract_info: contract_store.contract_info,
            contract_update_history: contract_store.contract_update_history,
            is_digit_contract: contract_store.is_digit_contract,
            is_sell_requested: contract_replay.is_sell_requested,
            is_valid_to_cancel: contract_replay.is_valid_to_cancel,
            onClickCancel: contract_replay.onClickCancel,
            onClickSell: contract_replay.onClickSell,
            onMount: contract_replay.onMount,
            onUnmount: contract_replay.onUnmount,
            indicative_status: contract_replay.indicative_status,
            is_chart_loading: contract_replay.is_chart_loading,
            is_dark_theme: ui.is_dark_mode_on,
            NotificationMessages: ui.notification_messages_ui,
            toggleHistoryTab: ui.toggleHistoryTab,
        };
    })(ContractReplay)
);

// CHART -----------------------------------------

class Chart extends React.Component {
    get is_bottom_widget_visible() {
        return isDesktop() && this.props.is_digit_contract;
    }

    render() {
        return (
            <SmartChart
                barriers={this.props.barriers_array}
                bottomWidgets={this.is_bottom_widget_visible ? ChartBottomWidgets : null}
                chartControlsWidgets={null}
                chartType={this.props.chart_type}
                endEpoch={this.props.end_epoch}
                margin={this.props.margin || null}
                isMobile={isMobile()}
                enabledNavigationWidget={isDesktop()}
                granularity={this.props.granularity}
                requestAPI={this.props.wsSendRequest}
                requestForget={this.props.wsForget}
                requestForgetStream={this.props.wsForgetStream}
                crosshairState={isMobile() ? 0 : undefined}
                maxTick={isMobile() ? 8 : undefined}
                requestSubscribe={this.props.wsSubscribe}
                settings={this.props.settings}
                startEpoch={this.props.start_epoch}
                scrollToEpoch={this.props.scroll_to_epoch}
                chartStatusListener={this.props.setIsChartReady}
                symbol={this.props.symbol}
                topWidgets={ChartTopWidgets}
                isConnectionOpened={this.props.is_socket_opened}
                isStaticChart={false}
                shouldFetchTradingTimes={!this.props.end_epoch}
            >
                {this.props.markers_array.map(marker => (
                    <ChartMarker
                        key={marker.react_key}
                        marker_config={marker.marker_config}
                        marker_content_props={marker.content_config}
                        is_bottom_widget_visible={this.is_bottom_widget_visible}
                    />
                ))}
            </SmartChart>
        );
    }
}

Chart.propTypes = {
    barriers_array: PropTypes.array,
    BottomWidgets: PropTypes.node,
    chart_type: PropTypes.string,
    end_epoch: PropTypes.number,
    granularity: PropTypes.number,
    InfoBox: PropTypes.node,
    is_mobile: PropTypes.bool,
    is_socket_opened: PropTypes.bool,
    is_static_chart: PropTypes.bool,
    margin: PropTypes.number,
    markers_array: PropTypes.array,
    replay_controls: PropTypes.object,
    scroll_to_epoch: PropTypes.number,
    settings: PropTypes.object,
    start_epoch: PropTypes.number,
    symbol: PropTypes.string,
    wsForget: PropTypes.func,
    wsForgetStream: PropTypes.func,
    wsSendRequest: PropTypes.func,
    wsSubscribe: PropTypes.func,
};

const ReplayChart = connect(({ modules, ui, common }) => {
    const trade = modules.trade;
    const contract_replay = modules.contract_replay;
    const contract_store = contract_replay.contract_store;
    const contract_config = contract_store.contract_config;
    const is_chart_ready = contract_replay.is_chart_ready;
    const settings = {
        lang: common.current_language,
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        countdown: ui.is_chart_countdown_visible,
        assetInformation: false, // ui.is_chart_asset_info_visible,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI
    };
    return {
        end_epoch: contract_config.end_epoch,
        chart_type: contract_config.chart_type,
        start_epoch: contract_config.start_epoch,
        granularity: contract_config.granularity,
        scroll_to_epoch: is_chart_ready ? contract_config.scroll_to_epoch : undefined,
        settings,
        is_mobile: ui.is_mobile,
        is_socket_opened: common.is_socket_opened,
        is_digit_contract: contract_store.is_digit_contract,
        setIsChartReady: contract_replay.setIsChartReady,
        margin: contract_replay.margin,
        is_static_chart: contract_replay.is_static_chart,
        barriers_array: contract_store.barriers_array,
        markers_array: contract_store.markers_array,
        symbol: contract_store.contract_info.underlying,
        wsForget: trade.wsForget,
        wsSubscribe: trade.wsSubscribe,
        wsSendRequest: trade.wsSendRequest,
        wsForgetStream: trade.wsForgetStream,
    };
})(Chart);

import classNames from 'classnames';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    DesktopWrapper,
    Div100vhContainer,
    MobileWrapper,
    PageOverlay,
    SwipeableWrapper,
    FadeWrapper,
} from '@deriv/components';
import {
    getContractTypeFeatureFlag,
    isAccumulatorContract,
    isDesktop,
    isEmptyObject,
    isHighLow,
    isMultiplierContract,
    isTurbosContract,
    isVanillaContract,
    isSmartTraderContract,
    urlFor,
} from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useFeatureFlags } from '@deriv/hooks';
import ChartLoader from 'App/Components/Elements/chart-loader';
import ContractDrawer from 'App/Components/Elements/ContractDrawer';
import UnsupportedContractModal from 'App/Components/Elements/Modals/UnsupportedContractModal';
import { DigitsWidget, InfoBoxWidget } from './contract-replay-widget';
import ReplayChart from './replay-chart';
import { observer, useStore } from '@deriv/stores';

type TLocationState = { from_table_row: boolean };

const ContractReplay = observer(({ contract_id }: { contract_id: number }) => {
    const { state } = useLocation<TLocationState>();
    const { common, contract_replay, ui } = useStore();
    const [swipe_index, setSwipeIndex] = React.useState(0);
    const { contract_store } = contract_replay;
    const {
        is_market_closed,
        is_sell_requested,
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
    const {
        is_dark_mode_on: is_dark_theme,
        is_mobile,
        notification_messages_ui: NotificationMessages,
        toggleHistoryTab,
    } = ui;
    const trade_type_feature_flag =
        contract_info.shortcode &&
        getContractTypeFeatureFlag(contract_info.contract_type ?? '', isHighLow(contract_info));
    const is_trade_type_disabled =
        useFeatureFlags()[`is_${trade_type_feature_flag}_enabled` as keyof ReturnType<typeof useFeatureFlags>] ===
        false;
    const [is_visible, setIsVisible] = React.useState(false);
    const history = useHistory();

    React.useEffect(() => {
        const url_array = /[^/]*$/.exec(location.pathname);
        const url_contract_id = url_array ? +url_array[0] : undefined;
        onMount(contract_id || url_contract_id);
        setIsVisible(true);

        return () => {
            setIsVisible(false);
            onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract_id, location, onMount, onUnmount]);

    const onClickClose = React.useCallback(() => {
        setIsVisible(false);
        const is_from_table_row = !isEmptyObject(state) ? state.from_table_row : false;
        return is_from_table_row ? history.goBack() : routeBackInApp(history);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, routeBackInApp]);

    React.useEffect(() => {
        // don't open Contract details page for trade types with disabled feature flag:
        if (is_trade_type_disabled && is_visible) {
            onClickClose();
        }
    }, [is_trade_type_disabled, is_visible, onClickClose]);

    const onChangeSwipeableIndex = (index: number) => {
        setSwipeIndex(index);
    };

    if (!contract_info.underlying) return null;

    const is_accumulator = isAccumulatorContract(contract_info.contract_type);
    const is_multiplier = isMultiplierContract(contract_info.contract_type);
    const is_turbos = isTurbosContract(contract_info.contract_type);
    const is_vanilla = isVanillaContract(contract_info.contract_type);
    const is_smarttrader_contract = isSmartTraderContract(contract_info.contract_type);

    const contract_drawer_el = (
        <ContractDrawer
            contract_info={contract_info}
            contract_update={contract_update}
            contract_update_history={contract_update_history}
            is_accumulator={is_accumulator}
            is_dark_theme={is_dark_theme}
            is_market_closed={is_market_closed}
            is_multiplier={is_multiplier}
            is_turbos={is_turbos}
            is_sell_requested={is_sell_requested}
            is_vanilla={is_vanilla}
            is_smarttrader_contract={is_smarttrader_contract}
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
                header={<Localize i18n_default_text='Contract details' />}
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
                                'contract-drawer__mobile-wrapper--is-multiplier': is_mobile && is_multiplier,
                            })}
                        >
                            {contract_drawer_el}
                        </div>
                    </MobileWrapper>
                    <React.Suspense fallback={<div />}>
                        <div
                            className={classNames('replay-chart__container', {
                                'replay-chart__container--is-multiplier': is_mobile && is_multiplier,
                                'vanilla-trade-chart': is_vanilla,
                            })}
                        >
                            <DesktopWrapper>
                                <NotificationMessages />
                            </DesktopWrapper>
                            <ChartLoader is_dark={is_dark_theme} is_visible={is_chart_loading} />
                            <DesktopWrapper>
                                <ReplayChart
                                    is_dark_theme_prop={is_dark_theme}
                                    is_accumulator_contract={is_accumulator}
                                />
                            </DesktopWrapper>
                            <MobileWrapper>
                                {is_digit_contract ? (
                                    <React.Fragment>
                                        <InfoBoxWidget />
                                        <SwipeableWrapper
                                            className='replay-chart__container-swipeable-wrapper'
                                            is_swipe_disabled={swipe_index === 1}
                                            onChange={
                                                onChangeSwipeableIndex as React.ComponentProps<
                                                    typeof SwipeableWrapper
                                                >['onChange']
                                            }
                                        >
                                            <DigitsWidget />
                                            <ReplayChart />
                                        </SwipeableWrapper>
                                    </React.Fragment>
                                ) : (
                                    <ReplayChart
                                        is_dark_theme_prop={is_dark_theme}
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

export default ContractReplay;

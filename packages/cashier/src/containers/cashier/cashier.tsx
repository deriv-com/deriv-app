import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
    Button,
    DesktopWrapper,
    Div100vhContainer,
    FadeWrapper,
    MobileWrapper,
    PageOverlay,
    VerticalTab,
    Loading,
} from '@deriv/components';
import { getSelectedRoute, getStaticUrl, isMobile, routes, WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import AccountPromptDialog from '../../components/account-prompt-dialog';
import ErrorDialog from '../../components/error-dialog';
import { TRootStore, TRoute } from '../../types';
import './cashier.scss';
import { observer, useStore } from '@deriv/stores';
import { useCashierStore } from '../../stores/useCashierStores';

type TCashierProps = RouteComponentProps & {
    routes: TRoute[];
    tab_index: number;
    onMount: (should_remount?: boolean) => void;
    setAccountSwitchListener: () => void;
    setTabIndex: (index: number) => void;
    routeBackInApp: TRootStore['common']['routeBackInApp'];
    toggleCashier: TRootStore['ui']['toggleCashier'];
    resetLastLocation: () => void;
    is_pre_appstore: boolean;
};

type TCashierOptions = {
    count?: number;
    default?: boolean;
    has_side_note: boolean;
    icon?: string;
    label: string;
    path?: string;
    value: TRoute['component'];
};

const Cashier = observer(({ history, location, routes: routes_config }: TCashierProps) => {
    const { common, ui, client } = useStore();
    const {
        withdraw,
        general_store,
        account_transfer,
        transaction_history,
        onramp,
        payment_agent_transfer,
        payment_agent,
        account_prompt_dialog,
    } = useCashierStore();
    const { error } = withdraw;
    const {
        is_cashier_onboarding,
        is_loading,
        is_p2p_enabled,
        onMountCommon: onMount,
        p2p_notification_count,
        setAccountSwitchListener,
        setCashierTabIndex: setTabIndex,
        cashier_route_tab_index: tab_index,
    } = general_store;
    const { is_account_transfer_visible } = account_transfer;
    const { is_crypto_transactions_visible } = transaction_history;
    const { is_onramp_tab_visible } = onramp;
    const { is_payment_agent_transfer_visible } = payment_agent_transfer;
    const { is_payment_agent_visible } = payment_agent;
    const { resetLastLocation } = account_prompt_dialog;
    const { routeBackInApp, is_from_derivgo } = common;
    const { is_cashier_visible: is_visible, toggleCashier } = ui;
    const { is_account_setting_loaded, is_logged_in, is_logging_in, is_pre_appstore } = client;
    React.useEffect(() => {
        toggleCashier();
        // we still need to populate the tabs shown on cashier
        return () => {
            toggleCashier();
            resetLastLocation();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggleCashier]);

    React.useEffect(() => {
        (async () => {
            await WS?.wait('authorize');
            if (is_logged_in) {
                onMount();
                setAccountSwitchListener();
            }
        })();
    }, [is_logged_in, onMount, setAccountSwitchListener]);

    const onClickClose = () => (is_pre_appstore ? history.push(routes.traders_hub) : routeBackInApp(history));
    const getMenuOptions = () => {
        const options: TCashierOptions[] = [];
        routes_config.forEach(route => {
            if (
                !route.is_invisible &&
                (route.path !== routes.cashier_pa || is_payment_agent_visible) &&
                (route.path !== routes.cashier_pa_transfer || is_payment_agent_transfer_visible) &&
                (route.path !== routes.cashier_p2p || is_p2p_enabled) &&
                (route.path !== routes.cashier_onramp || is_onramp_tab_visible) &&
                (route.path !== routes.cashier_acc_transfer || is_account_transfer_visible)
            ) {
                options.push({
                    ...(route.path === routes.cashier_p2p && { count: p2p_notification_count }),
                    default: route.default,
                    icon: route.icon_component,
                    label: route.getTitle(),
                    value: route.component,
                    path: route.path,
                    has_side_note: is_crypto_transactions_visible ? false : route.path !== routes.cashier_p2p, // Set to true to create the 3-column effect without passing any content. If there is content, the content should be passed in.
                });
            }
        });

        return options;
    };

    const selected_route = getSelectedRoute({ routes: routes_config, pathname: location.pathname });
    // const should_show_tab_headers_note =
    //     !is_virtual &&
    //     (location.pathname.startsWith(routes.cashier_deposit) ||
    //         location.pathname.startsWith(routes.cashier_withdrawal));

    const is_default_route = !!getSelectedRoute({ routes: routes_config, pathname: location.pathname }).default;

    // '|| !is_account_setting_loaded' condition added to make sure client_tnc_status loaded
    if (((!is_logged_in || isMobile()) && is_logging_in) || !is_account_setting_loaded) {
        return <Loading is_fullscreen />;
    }

    const getHeaderTitle = () => {
        if (!isMobile() || (is_default_route && (is_loading || is_cashier_onboarding))) return localize('Cashier');

        return selected_route.getTitle();
    };

    return (
        <FadeWrapper is_visible={is_visible} className='cashier__page-wrapper' keyname='cashier__page-wrapper'>
            <AccountPromptDialog />
            <ErrorDialog error={error} />
            <div className='cashier'>
                <PageOverlay header={getHeaderTitle()} onClickClose={onClickClose} is_from_app={is_from_derivgo}>
                    <DesktopWrapper>
                        <VerticalTab
                            alignment='center'
                            id='cashier'
                            classNameHeader='cashier__tab-header'
                            current_path={location.pathname}
                            is_floating
                            setVerticalTabIndex={setTabIndex}
                            vertical_tab_index={is_default_route ? 0 : tab_index}
                            is_full_width
                            is_routed
                            list={getMenuOptions()}
                            tab_headers_note={
                                <Button
                                    id='cashier_learn_more'
                                    className='cashier__page-wrapper-button'
                                    text={localize('Learn more about payment methods')}
                                    onClick={() => window.open(getStaticUrl('/payment-methods'))}
                                    secondary
                                />
                            }
                            // TODO: Uncomment when Ewallet.Exchange is available
                            // tab_headers_note={
                            //     should_show_tab_headers_note ? (
                            //         <Text as='p' size='xxs' className='cashier__tab-header-note'>
                            //             <Localize
                            //                 i18n_default_text='Want to exchange between e-wallet currencies? Try <0>Ewallet.Exchange</0>'
                            //                 components={[
                            //                     <a
                            //                         key={0}
                            //                         href='https://ewallet.exchange'
                            //                         rel='noopener noreferrer'
                            //                         target='_blank'
                            //                         className='link'
                            //                     />,
                            //                 ]}
                            //             />
                            //         </Text>
                            //     ) : undefined
                            // }
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Div100vhContainer className='cashier__wrapper--is-mobile' height_offset='80px'>
                            {selected_route && (
                                <selected_route.component
                                    component_icon={selected_route.icon_component}
                                    history={history}
                                    menu_options={getMenuOptions()}
                                />
                            )}
                        </Div100vhContainer>
                    </MobileWrapper>
                </PageOverlay>
            </div>
        </FadeWrapper>
    );
});
export default withRouter(Cashier);

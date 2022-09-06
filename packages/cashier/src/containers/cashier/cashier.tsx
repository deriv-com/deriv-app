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
import AccountPromptDialog from 'Components/account-prompt-dialog';
import ErrorDialog from 'Components/error-dialog';
import { connect } from 'Stores/connect';
import { TClientStore, TCommonStore, TError, TRootStore, TRoute, TUiStore } from 'Types';
import './cashier.scss';

type TCashierProps = RouteComponentProps & {
    error: TError;
    is_account_transfer_visible: boolean;
    is_account_setting_loaded: TClientStore['is_account_setting_loaded'];
    is_cashier_onboarding: boolean;
    is_crypto: boolean;
    is_crypto_transactions_visible: boolean;
    is_loading: boolean;
    is_logged_in: TClientStore['is_logged_in'];
    is_logging_in: TClientStore['is_logging_in'];
    is_from_derivgo: TCommonStore['is_from_derivgo'];
    is_onramp_tab_visible: boolean;
    is_p2p_enabled: boolean;
    is_payment_agent_transfer_visible: boolean;
    is_payment_agent_visible: boolean;
    is_visible: TUiStore['is_cashier_visible'];
    p2p_notification_count: number;
    routes: TRoute[];
    tab_index: number;
    onMount: (should_remount?: boolean) => void;
    setAccountSwitchListener: () => void;
    setTabIndex: (index: number) => void;
    routeBackInApp: TCommonStore['routeBackInApp'];
    toggleCashier: TUiStore['toggleCashier'];
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

const Cashier = ({
    error,
    history,
    is_account_transfer_visible,
    is_account_setting_loaded,
    is_cashier_onboarding,
    is_crypto,
    is_crypto_transactions_visible,
    is_loading,
    is_logged_in,
    is_logging_in,
    is_from_derivgo,
    is_onramp_tab_visible,
    is_p2p_enabled,
    is_payment_agent_transfer_visible,
    is_payment_agent_visible,
    // is_virtual,
    is_visible,
    location,
    onMount,
    p2p_notification_count,
    routeBackInApp,
    routes: routes_config,
    setAccountSwitchListener,
    setTabIndex,
    tab_index,
    toggleCashier,
}: TCashierProps) => {
    React.useEffect(() => {
        toggleCashier();
        // we still need to populate the tabs shown on cashier
        return () => {
            toggleCashier();
        };
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

    const onClickClose = () => routeBackInApp(history);
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

    const getSideNoteClassName = () => {
        return location.pathname?.endsWith(routes.cashier_withdrawal) && !is_crypto ? 'cashier__side-note' : '';
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
                            side_note_class_name={getSideNoteClassName()}
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
};

export default connect(({ client, common, modules, ui }: TRootStore) => ({
    error: modules.cashier.withdraw.error,
    is_cashier_onboarding: modules.cashier.general_store.is_cashier_onboarding,
    is_account_transfer_visible: modules.cashier.account_transfer.is_account_transfer_visible,
    is_account_setting_loaded: client.is_account_setting_loaded,
    is_crypto: modules.cashier.general_store.is_crypto,
    is_crypto_transactions_visible: modules.cashier.transaction_history.is_crypto_transactions_visible,
    is_loading: modules.cashier.general_store.is_loading,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    is_from_derivgo: common.is_from_derivgo,
    is_onramp_tab_visible: modules.cashier.onramp.is_onramp_tab_visible,
    is_p2p_enabled: modules.cashier.general_store.is_p2p_enabled,
    is_payment_agent_transfer_visible: modules.cashier.payment_agent_transfer.is_payment_agent_transfer_visible,
    is_payment_agent_visible: modules.cashier.payment_agent.is_payment_agent_visible,
    is_virtual: client.is_virtual,
    is_visible: ui.is_cashier_visible,
    onMount: modules.cashier.general_store.onMountCommon,
    p2p_notification_count: modules.cashier.general_store.p2p_notification_count,
    routeBackInApp: common.routeBackInApp,
    setAccountSwitchListener: modules.cashier.general_store.setAccountSwitchListener,
    setTabIndex: modules.cashier.general_store.setCashierTabIndex,
    tab_index: modules.cashier.general_store.cashier_route_tab_index,
    toggleCashier: ui.toggleCashier,
}))(withRouter(Cashier));

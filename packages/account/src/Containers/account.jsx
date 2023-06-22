import 'Styles/account.scss';
import {
    PlatformContext,
    getSelectedRoute,
    getStaticUrl,
    isMobile,
    matchRoute,
    routes as shared_routes,
} from '@deriv/shared';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { VerticalTab, FadeWrapper, PageOverlay, Loading, Text, Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { flatten } from '../Helpers/flatten';
import { localize } from '@deriv/translations';

const onClickLogout = (logout, history) => {
    history.push(shared_routes.index);
    logout().then(() => (window.location.href = getStaticUrl('/')));
};

const AccountLogout = ({ logout, history }) => {
    return (
        <div className='dc-vertical-tab__header account__logout ' onClick={() => onClickLogout(logout, history)}>
            <div className='dc-vertical-tab__header-group account__logout-tab'>
                <Text size='xxs' weight='normal'>
                    {localize('Log out')}
                </Text>
            </div>
        </div>
    );
};

const TradingHubLogout = ({ logout, history }) => {
    return (
        <div className='dc-vertical-tab__header-account__logout-tab' onClick={() => onClickLogout(logout, history)}>
            <div className='dc-vertical-tab__header-account__logout'>
                <Icon icon='IcLogout' className='dc-vertical-tab__header-account__logout--icon' />
                <Text size='xs' weight='bold'>
                    {localize('Log out')}
                </Text>
            </div>
        </div>
    );
};

const PageOverlayWrapper = ({
    is_from_derivgo,
    is_appstore,
    list_groups,
    logout,
    onClickClose,
    selected_route,
    subroutes,
    history,
}) => {
    const routeToPrevious = () => history.push(shared_routes.traders_hub);

    if (isMobile() && selected_route) {
        return (
            <PageOverlay
                header={selected_route.getTitle()}
                onClickClose={routeToPrevious}
                is_from_app={is_from_derivgo}
            >
                <selected_route.component component_icon={selected_route.icon_component} />
            </PageOverlay>
        );
    } else if (is_appstore) {
        return (
            <VerticalTab
                title={selected_route.getTitle()}
                onClickClose={onClickClose}
                is_collapsible={false}
                is_grid
                is_floating
                className='dashboard'
                current_path={location.pathname}
                is_routed
                is_full_width
                list={subroutes}
                list_groups={list_groups}
                extra_content={is_appstore && <AccountLogout logout={logout} history={history} />}
            />
        );
    }

    return (
        <PageOverlay header={localize('Settings')} onClickClose={routeToPrevious} is_from_app={is_from_derivgo}>
            <VerticalTab
                is_floating
                current_path={location.pathname}
                is_routed
                is_full_width
                list={subroutes}
                list_groups={list_groups}
                extra_content={<TradingHubLogout logout={logout} history={history} />}
            />
        </PageOverlay>
    );
};

const Account = observer(({ history, location, routes }) => {
    const { client, common, ui } = useStore();
    const {
        is_virtual,
        is_logged_in,
        is_logging_in,
        is_risky_client,
        is_pending_proof_of_ownership,
        landing_company_shortcode,
        should_allow_authentication,
        logout,
    } = client;
    const { is_from_derivgo, routeBackInApp, platform } = common;
    const { toggleAccountSettings, is_account_settings_visible } = ui;
    const { is_appstore } = React.useContext(PlatformContext);
    const subroutes = flatten(routes.map(i => i.subroutes));
    let list_groups = [...routes];
    list_groups = list_groups.map(route_group => ({
        icon: route_group.icon,
        label: route_group.getTitle(),
        subitems: route_group.subroutes.map(sub => subroutes.indexOf(sub)),
    }));
    let selected_content = subroutes.find(r => matchRoute(r, location.pathname));
    const onClickClose = React.useCallback(() => routeBackInApp(history), [routeBackInApp, history]);

    React.useEffect(() => {
        toggleAccountSettings(true);
    }, [toggleAccountSettings]);

    routes.forEach(menu_item => {
        menu_item.subroutes.forEach(route => {
            if (route.path === shared_routes.financial_assessment) {
                route.is_disabled = is_virtual || (landing_company_shortcode === 'maltainvest' && !is_risky_client);
            }

            if (route.path === shared_routes.trading_assessment) {
                route.is_disabled = is_virtual || landing_company_shortcode !== 'maltainvest';
            }

            if (route.path === shared_routes.proof_of_identity || route.path === shared_routes.proof_of_address) {
                route.is_disabled = !should_allow_authentication;
            }

            if (route.path === shared_routes.proof_of_ownership) {
                route.is_disabled = is_virtual || !is_pending_proof_of_ownership;
            }
        });
    });

    if (!selected_content) {
        // fallback
        selected_content = subroutes[0];
        history.push(shared_routes.personal_details);
    }

    if (!is_logged_in && is_logging_in) {
        return <Loading is_fullscreen className='account__initial-loader' />;
    }

    const selected_route = getSelectedRoute({ routes: subroutes, pathname: location.pathname });

    return (
        <FadeWrapper
            is_visible={is_account_settings_visible}
            className='account-page-wrapper'
            keyname='account-page-wrapper'
        >
            <div className='account'>
                <PageOverlayWrapper
                    is_from_derivgo={is_from_derivgo}
                    is_appstore={is_appstore}
                    list_groups={list_groups}
                    logout={logout}
                    onClickClose={onClickClose}
                    platform={platform}
                    selected_route={selected_route}
                    subroutes={subroutes}
                    history={history}
                />
            </div>
        </FadeWrapper>
    );
});

Account.propTypes = {
    active_account_landing_company: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    routes: PropTypes.arrayOf(PropTypes.object),
};

export default withRouter(Account);

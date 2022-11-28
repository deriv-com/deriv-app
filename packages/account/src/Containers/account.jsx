import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { VerticalTab, FadeWrapper, PageOverlay, Loading, Text } from '@deriv/components';
import { routes as shared_routes, isMobile, matchRoute, getSelectedRoute, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { flatten } from '../Helpers/flatten';
import AccountLimitInfo from '../Sections/Security/AccountLimits/account-limits-info.jsx';
import 'Styles/account.scss';

const AccountLogout = ({ logout, history }) => {
    return (
        <div
            className='dc-vertical-tab__header account__logout '
            onClick={() => {
                history.push(shared_routes.index);
                logout();
            }}
        >
            <div className='dc-vertical-tab__header-group account__logout-tab'>
                <Text color='general' size='xxs' weight='normal'>
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
}) => {
    if (isMobile() && selected_route) {
        return (
            <PageOverlay header={selected_route.getTitle()} onClickClose={onClickClose} is_from_app={is_from_derivgo}>
                <selected_route.component component_icon={selected_route.icon_component} />
            </PageOverlay>
        );
    } else if (is_appstore) {
        return (
            <VerticalTab
                title={selected_route.getTitle()}
                onClickClose={onClickClose}
                alignment='center'
                is_collapsible={false}
                is_grid
                is_floating
                className='dashboard'
                classNameHeader='account__inset_header'
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
        <PageOverlay header={localize('Settings')} onClickClose={onClickClose} is_from_app={is_from_derivgo}>
            <VerticalTab
                alignment='center'
                is_floating
                classNameHeader='account__inset_header'
                current_path={location.pathname}
                is_routed
                is_full_width
                list={subroutes}
                list_groups={list_groups}
            />
        </PageOverlay>
    );
};

const Account = ({
    active_account_landing_company,
    currency,
    history,
    is_from_derivgo,
    is_logged_in,
    is_logging_in,
    is_risky_client,
    is_virtual,
    is_visible,
    location,
    logout,
    platform,
    routeBackInApp,
    routes,
    should_allow_authentication,
    toggleAccount,
}) => {
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
        toggleAccount(true);
    }, [toggleAccount]);

    routes.forEach(menu_item => {
        menu_item.subroutes.forEach(route => {
            if (route.path === shared_routes.financial_assessment) {
                route.is_disabled =
                    is_virtual || (active_account_landing_company === 'maltainvest' && !is_risky_client);
            }
            if (route.path === shared_routes.trading_assessment) {
                route.is_disabled = is_virtual || active_account_landing_company !== 'maltainvest';
            }

            if (route.path === shared_routes.proof_of_identity || route.path === shared_routes.proof_of_address) {
                route.is_disabled = !should_allow_authentication;
            }
        });
    });

    if (!selected_content) {
        // fallback
        selected_content = subroutes[0];
        history.push(shared_routes.personal_details);
    }

    const action_bar_items = [
        {
            onClick: () => {
                routeBackInApp(history);
            },
            icon: 'IcCross',
            title: localize('Close'),
        },
    ];

    const is_account_limits_route = selected_content.path === routes.account_limits;

    if (is_account_limits_route) {
        action_bar_items.push({
            // eslint-disable-next-line react/display-name
            component: () => <AccountLimitInfo currency={currency} is_virtual={is_virtual} />,
        });
    }

    if (!is_logged_in && is_logging_in) {
        return <Loading is_fullscreen className='account__initial-loader' />;
    }

    const selected_route = getSelectedRoute({ routes: subroutes, pathname: location.pathname });

    return (
        <FadeWrapper is_visible={is_visible} className='account-page-wrapper' keyname='account-page-wrapper'>
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
                />
            </div>
        </FadeWrapper>
    );
};

Account.propTypes = {
    active_account_landing_company: PropTypes.string,
    currency: PropTypes.string,
    history: PropTypes.object,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_from_derivgo: PropTypes.bool,
    is_risky_client: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    logout: PropTypes.func,
    platform: PropTypes.string,
    routeBackInApp: PropTypes.func,
    routes: PropTypes.arrayOf(PropTypes.object),
    should_allow_authentication: PropTypes.bool,
    toggleAccount: PropTypes.func,
};

export default connect(({ client, common, ui }) => ({
    active_account_landing_company: client.landing_company_shortcode,
    currency: client.currency,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    is_from_derivgo: common.is_from_derivgo,
    is_risky_client: client.is_risky_client,
    is_virtual: client.is_virtual,
    is_visible: ui.is_account_settings_visible,
    logout: client.logout,
    platform: common.platform,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
    toggleAccount: ui.toggleAccountSettings,
}))(withRouter(Account));

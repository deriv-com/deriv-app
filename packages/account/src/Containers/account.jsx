import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { VerticalTab, DesktopWrapper, MobileWrapper, FadeWrapper, PageOverlay, Loading } from '@deriv/components';
import { routes as shared_routes, isEmptyObject, isMobile, getSelectedRoute } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { flatten } from '../Helpers/flatten';
import AccountLimitInfo from '../Sections/Security/AccountLimits/account-limits-info.jsx';
import 'Styles/account.scss';

const Account = ({
    account_status,
    currency,
    history,
    is_logged_in,
    is_logging_in,
    is_virtual,
    is_visible,
    location,
    needs_financial_assessment,
    routeBackInApp,
    routes,
    should_allow_authentication,
    toggleAccount,
}) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const subroutes = flatten(routes.map(i => i.subroutes));
    let list_groups = [...routes];
    list_groups = list_groups.map(route_group => ({
        icon: route_group.icon,
        label: route_group.getTitle(),
        subitems: route_group.subroutes.map(sub => subroutes.indexOf(sub)),
    }));
    let selected_content = subroutes.filter(route => route.path === location.pathname)[0];
    const onClickClose = React.useCallback(() => routeBackInApp(history), [routeBackInApp, history]);

    React.useEffect(() => {
        if (should_allow_authentication) {
            setIsLoading(false);
        }
        toggleAccount(true);
    }, [should_allow_authentication, toggleAccount]);

    if (
        !is_loading &&
        !isEmptyObject(account_status) &&
        ((!needs_financial_assessment && /financial-assessment/.test(selected_content.path)) ||
            (!should_allow_authentication && /proof-of-identity|proof-of-address/.test(selected_content.path)))
    )
        routeBackInApp(history);

    routes.forEach(menu_item => {
        menu_item.subroutes.forEach(route => {
            if (route.path === shared_routes.financial_assessment) {
                route.is_disabled = !needs_financial_assessment;
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
                <PageOverlay
                    header={isMobile() ? selected_route.getTitle() : localize('Settings')}
                    onClickClose={onClickClose}
                >
                    <DesktopWrapper>
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
                    </DesktopWrapper>
                    <MobileWrapper>
                        {selected_route && <selected_route.component component_icon={selected_route.icon_component} />}
                    </MobileWrapper>
                </PageOverlay>
            </div>
        </FadeWrapper>
    );
};

Account.propTypes = {
    account_status: PropTypes.object,
    currency: PropTypes.string,
    history: PropTypes.object,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    needs_financial_assessment: PropTypes.bool,
    routes: PropTypes.arrayOf(PropTypes.object),
    should_allow_authentication: PropTypes.bool,
    toggleAccount: PropTypes.func,
};

export default connect(({ client, common, ui }) => ({
    account_status: client.account_status,
    currency: client.currency,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    is_virtual: client.is_virtual,
    is_visible: ui.is_account_settings_visible,
    needs_financial_assessment: client.needs_financial_assessment,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
    toggleAccount: ui.toggleAccountSettings,
}))(withRouter(Account));

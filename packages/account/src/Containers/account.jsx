import PropTypes from 'prop-types';
import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { VerticalTab, DesktopWrapper, MobileWrapper, FadeWrapper, PageOverlay } from '@deriv/components';
import { routes, isMobile, getSelectedRoute } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { flatten } from '../Helpers/flatten';
import AccountLimitInfo from '../Sections/Security/AccountLimits/account-limits-info.jsx';
import 'Styles/account.scss';

const Account = ({
    should_allow_authentication,
    currency,
    history,
    is_virtual,
    is_visible,
    location: props_location,
    needs_financial_assessment,
    routeBackInApp,
    routes: props_routes,
    toggleAccount,
}) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [should_allow_document_upload, setShouldAllowDocumentUpload] = React.useState(false);

    React.useEffect(() => {
        toggleAccount(true);
        return () => toggleAccount(false);
    }, [toggleAccount]);

    React.useEffect(() => {
        if (typeof should_allow_authentication === 'boolean') {
            setIsLoading(false);
            setShouldAllowDocumentUpload(should_allow_authentication);
        }
    }, [should_allow_authentication, setShouldAllowDocumentUpload]);

    const subroutes = flatten(props_routes.map(route => route.subroutes));

    let selected_content = subroutes.filter(route => route.path === props_location.pathname)[0];

    if (!selected_content) {
        // fallback
        selected_content = subroutes[0];
        history.push(routes.personal_details);
    }

    const has_incorrect_path =
        (!needs_financial_assessment && /financial-assessment/.test(selected_content.path)) ||
        (!should_allow_document_upload && /proof-of-identity|proof-of-address/.test(selected_content.path));

    if (!is_loading && has_incorrect_path) {
        return <Redirect to={routes.trade} />;
    }

    // TODO: modify account route to support disabled
    props_routes.forEach(route => {
        route.subroutes.forEach(subroute => {
            if (subroute.path === routes.financial_assessment) {
                subroute.is_disabled = !needs_financial_assessment;
            }

            if (subroute.path === routes.proof_of_identity || subroute.path === routes.proof_of_address) {
                subroute.is_disabled = !should_allow_document_upload;
            }
        });
    });

    const action_bar_items = [
        {
            onClick: () => history.push(routes.trade),
            icon: 'IcCross',
            title: localize('Close'),
        },
    ];

    const is_account_limits_route = selected_content.path === routes.account_limits;

    if (is_account_limits_route) {
        const Component = () => <AccountLimitInfo currency={currency} is_virtual={is_virtual} />;
        Component.displayName = 'AccountLimitInfo';
        action_bar_items.push({ component: Component });
    }

    const list_groups = [...props_routes].map(route_group => ({
        icon: route_group.icon,
        label: route_group.getTitle(),
        subitems: route_group.subroutes.map(sub => subroutes.indexOf(sub)),
    }));

    const selected_route = getSelectedRoute({ routes: subroutes, pathname: props_location.pathname });
    const onClickClose = () => routeBackInApp(history);

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
                            current_path={props_location.pathname}
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
    is_virtual: PropTypes.bool,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    needs_financial_assessment: PropTypes.bool,
    routeBackInApp: PropTypes.func,
    routes: PropTypes.arrayOf(PropTypes.object),
    should_allow_authentication: PropTypes.bool,
    toggleAccount: PropTypes.func,
};

export default connect(({ client, common, ui }) => ({
    account_status: client.account_status,
    currency: client.currency,
    is_virtual: client.is_virtual,
    is_visible: ui.is_account_settings_visible,
    needs_financial_assessment: client.needs_financial_assessment,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
    toggleAccount: ui.toggleAccountSettings,
}))(withRouter(Account));

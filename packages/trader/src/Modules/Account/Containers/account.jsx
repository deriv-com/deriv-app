import PropTypes         from 'prop-types';
import React, { lazy }   from 'react';
import {
    withRouter,
    Redirect }           from 'react-router-dom';
import SideMenu          from 'App/Components/Elements/SideMenu';
import { FadeWrapper }   from 'App/Components/Animations';
import { localize }      from 'deriv-translations';
import AppRoutes         from 'Constants/routes';
import { connect }       from 'Stores/connect';
import { WS }            from 'Services/ws-methods';
import { flatten }       from '../Helpers/flatten';
import AccountLimitInfo  from '../Sections/Security/AccountLimits/account-limits-info.jsx';
import                        'Sass/app/modules/account.scss';

const DemoMessage = lazy(() => import(/* webpackChunkName: 'demo_message' */ 'Modules/Account/Sections/ErrorMessages/DemoMessage'));

const fallback_content = {
    path     : AppRoutes.personal_details,
    component: DemoMessage,
    title    : localize('Personal details'),
};

class Account extends React.Component {
    state = {
        is_high_risk_client: false,
        is_loading         : true,
        needs_verification : false,
    }

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && !event.target.classList.contains('dc-dropdown-list__item')) {
            this.props.history.push(AppRoutes.trade);
        }
    };

    componentDidMount() {
        WS.wait('authorize', 'get_account_status').then(() => {
            if (this.props.account_status) {
                const { authentication } = this.props.account_status;
                const is_high_risk_client = this.props.is_high_risk;
                const needs_verification = authentication.needs_verification.includes('identity') || authentication.needs_verification.includes('document');
                this.setState({ is_high_risk_client, is_loading: false, needs_verification });
            }
        });
        this.props.enableRouteMode();
        document.addEventListener('mousedown', this.handleClickOutside);
        this.props.toggleAccount(true);
    }

    componentWillUnmount() {
        this.props.toggleAccount(false);
        this.props.disableRouteMode();
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render () {
        const { is_high_risk_client, is_loading, needs_verification } = this.state;

        const subroutes      = flatten(this.props.routes.map(i => i.subroutes));
        let selected_content = subroutes.filter(route => route.path === this.props.location.pathname)[0];
        if (!selected_content) { // fallback
            selected_content = subroutes[0];
            this.props.history.push(AppRoutes.personal_details);
        }
        if (!is_loading && !needs_verification && !is_high_risk_client && /proof-of-identity|proof-of-address|financial-assessment/.test(selected_content.path)) return <Redirect to='/' />;

        // TODO: modify account route to support disabled
        this.props.routes.forEach((menu_item) => {
            if (menu_item.title === 'Verification') {
                menu_item.is_hidden = !needs_verification;
            }
            if (menu_item.title === 'Profile') {
                menu_item.subroutes.forEach(route => {
                    if (route.path === AppRoutes.financial_assessment) {
                        route.is_disabled = !is_high_risk_client;
                    }
                });
            }
        });

        const action_bar_items = [
            {
                onClick: () => {
                    this.props.history.push(AppRoutes.trade);
                },
                icon : 'ModalIconClose',
                title: localize('Close'),
            },
        ];

        const is_account_limits_route = selected_content.path === AppRoutes.account_limits;
        if (is_account_limits_route) {
            action_bar_items.push({
                component: () => <AccountLimitInfo currency={this.props.currency} is_virtual={this.props.is_virtual} />,
            });
        }

        const { title: active_title } = this.props.routes
            .find(route => route.subroutes
                .find(sub_route => sub_route.title === selected_content.title));

        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='account-page-wrapper'
                keyname='account-page-wrapper'
            >
                <div className='account' ref={this.setWrapperRef}>
                    <SideMenu
                        active_title={active_title}
                        action_bar={action_bar_items}
                        action_bar_classname='account__inset_header'
                        alignment='center'
                        fallback_content={fallback_content}
                        header_title={localize('Settings')}
                        is_routed={true}
                        is_full_width={true}
                        is_loading={is_loading}
                        list={this.props.routes}
                        selected_content={selected_content}
                        sub_list={subroutes}
                        tab_container_classname='account__tab_container'
                    />
                </div>
            </FadeWrapper>
        );
    }
}

Account.propTypes = {
    disableRouteMode: PropTypes.func,
    enableRouteMode : PropTypes.func,
    history         : PropTypes.object,
    is_visible      : PropTypes.bool,
    location        : PropTypes.object,
    routes          : PropTypes.arrayOf(PropTypes.object),
    toggleAccount   : PropTypes.func,
};

export default connect(
    ({ client, ui }) => ({
        account_status   : client.account_status,
        currency         : client.currency,
        is_high_risk     : client.is_high_risk,
        is_virtual       : client.is_virtual,
        getRiskAssessment: client.getRiskAssessment,
        disableRouteMode : ui.disableRouteModal,
        enableRouteMode  : ui.setRouteModal,
        is_visible       : ui.is_account_settings_visible,
        toggleAccount    : ui.toggleAccountSettings,
    })
)(withRouter(Account));

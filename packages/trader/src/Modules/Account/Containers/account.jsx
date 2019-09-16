import PropTypes        from 'prop-types';
import React, { lazy }  from 'react';
import { withRouter }   from 'react-router-dom';
import { FadeWrapper }  from 'App/Components/Animations';
import MenuAccordion    from 'App/Components/Elements/MenuAccordion';
import { localize }     from 'App/i18n';
import AppRoutes        from 'Constants/routes';
import { connect }      from 'Stores/connect';
import { flatten }      from '../Helpers/flatten';
import AccountLimitInfo from '../Sections/Security/AccountLimits/account-limits-info.jsx';
import 'Sass/app/modules/account.scss';

const DemoMessage = lazy(() => import(/* webpackChunkName: 'demo_message' */ 'Modules/Account/Sections/ErrorMessages/DemoMessage'));

const fallback_content = {
    'path'     : '/account/personal_details',
    'component': DemoMessage,
    'title'    : 'Personal details',
};

class Account extends React.Component {
    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            this.props.history.push(AppRoutes.trade);
        }
    };

    componentDidMount() {
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
        const action_bar_items = [
            {
                onClick: () => {
                    this.props.history.push(AppRoutes.trade);
                    this.props.toggleAccount(false);
                },
                icon : 'ModalIconClose',
                title: localize('Close'),
            },
        ];

        const is_account_limits_route = /account_limits/.test(this.props.location.pathname);
        if (is_account_limits_route) {
            action_bar_items.push({
                component: () => <AccountLimitInfo currency={this.props.currency} is_virtual={this.props.is_virtual} />,
            });
        }

        const subroutes        = flatten(this.props.routes);
        let selected_content = subroutes.filter(route => route.path === this.props.location.pathname)[0];

        if (!selected_content) { // fallback
            selected_content = subroutes[0];
            this.props.history.push(AppRoutes.personal_details);
        }
        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='account-page-wrapper'
                keyname='account-page-wrapper'
            >
                <div className='account' ref={this.setWrapperRef}>
                    <MenuAccordion
                        action_bar={action_bar_items}
                        action_bar_classname='account__inset_header'
                        alignment='center'
                        fallback_content={fallback_content}
                        header_title={localize('Settings')}
                        is_routed={true}
                        is_full_width={true}
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
        currency        : client.currency,
        is_virtual      : client.is_virtual,
        disableRouteMode: ui.disableRouteModal,
        enableRouteMode : ui.setRouteModal,
        is_visible      : ui.is_account_settings_visible,
        toggleAccount   : ui.toggleAccountSettings,
    })
)(withRouter(Account));

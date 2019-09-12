import PropTypes       from 'prop-types';
import React, { lazy } from 'react';
import { withRouter }  from 'react-router-dom';
import { FadeWrapper } from 'App/Components/Animations';
import MenuAccordion   from 'App/Components/Elements/MenuAccordion';
import AppRoutes       from 'Constants/routes';
import { connect }     from 'Stores/connect';
import 'Sass/app/modules/account.scss';

const DemoMessage = lazy(() => import(/* webpackChunkName: 'demo_message' */ 'Modules/Account/Sections/ErrorMessages/DemoMessage'));

const fallback_content = {
    'path'     : '/account/personal_details',
    'component': DemoMessage,
    'title'    : 'Personal details',
};

class Account extends React.Component {
    state = {
        header: this.props.routes[0].subroutes[0].title,
    };

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

    onChangeHeader = header => this.setState({ header });

    render () {
        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='account-page-wrapper'
                keyname='account-page-wrapper'
            >
                <div className='account' ref={this.setWrapperRef}>
                    {/* <VerticalTab
                        header_title={localize('Settings')}
                        action_bar={action_bar_items}
                        action_bar_classname='account__inset_header'
                        alignment='center'
                        id='account'
                        classNameHeader='account__tab-header'
                        current_path={this.props.location.pathname}
                        is_routed={true}
                        is_full_width={true}
                        list={menu_options()}
                    /> */}
                    <MenuAccordion
                        alignment='center'
                        classNameHeader='modal__tab-header'
                        fallback_content={fallback_content}
                        is_routed={true}
                        list={this.props.routes}
                        onChangeHeader={this.onChangeHeader}
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
    ({ ui }) => ({
        disableRouteMode: ui.disableRouteModal,
        enableRouteMode : ui.setRouteModal,
        is_visible      : ui.is_account_settings_visible,
        toggleAccount   : ui.toggleAccountSettings,
    })
)(withRouter(Account));

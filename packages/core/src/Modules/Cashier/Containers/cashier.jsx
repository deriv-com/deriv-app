import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { VerticalTab } from '@deriv/components';
import { localize } from '@deriv/translations';
import { FadeWrapper } from 'App/Components/Animations';
import routes from 'Constants/routes';
import { connect } from 'Stores/connect';
import WalletInformation from '../../Reports/Containers/wallet-information.jsx';

class Cashier extends React.Component {
    setWrapperRef = node => {
        this.wrapper_ref = node;
    };

    handleClickOutside = event => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            this.props.history.push(routes.trade);
        }
    };

    componentDidMount() {
        this.props.enableRouteMode();
        document.addEventListener('mousedown', this.handleClickOutside);
        this.props.toggleCashier();
        // we still need to populate the tabs shown on cashier
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.toggleCashier();
        this.props.disableRouteMode();
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render() {
        const menu_options = () => {
            const options = [];

            // TODO: remove show_dp2p hash check once released
            this.props.routes.forEach(route => {
                if (
                    (route.path !== routes.cashier_pa || this.props.is_payment_agent_visible) &&
                    (route.path !== routes.cashier_pa_transfer || this.props.is_payment_agent_transfer_visible) &&
                    (route.path !== routes.cashier_p2p ||
                        (this.props.is_p2p_visible && /show_p2p/.test(this.props.location.hash)))
                ) {
                    options.push({
                        ...(route.path === routes.cashier_p2p && { count: this.props.p2p_notification_count }),
                        default: route.default,
                        icon: route.icon_component,
                        label: route.title,
                        value: route.component,
                        path: route.path,
                    });
                }
            });

            return options;
        };

        const action_bar_items = [
            {
                onClick: () => {
                    this.props.history.push(routes.trade);
                },
                icon: 'IcCross',
                title: localize('Close'),
            },
            {
                component: () => <WalletInformation />,
                title: '',
            },
        ];
        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='cashier-page-wrapper'
                keyname='cashier-page-wrapper'
            >
                <div className='cashier' ref={this.setWrapperRef}>
                    <VerticalTab
                        header_title={localize('Cashier')}
                        action_bar={action_bar_items}
                        action_bar_classname='cashier__inset_header'
                        alignment='center'
                        id='cashier'
                        classNameHeader='cashier__tab-header'
                        current_path={this.props.location.pathname}
                        is_routed={true}
                        is_full_width={true}
                        list={menu_options()}
                        vertical_tab_index={this.props.vertical_tab_index}
                        setVerticalTabIndex={this.props.setVerticalTabIndex}
                    />
                </div>
            </FadeWrapper>
        );
    }
}

Cashier.propTypes = {
    disableRouteMode: PropTypes.func,
    enableRouteMode: PropTypes.func,
    history: PropTypes.object,
    is_p2p_visible: PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    onMount: PropTypes.func,
    p2p_notification_count: PropTypes.number,
    routes: PropTypes.arrayOf(PropTypes.object),
    setVerticalTabIndex: PropTypes.func,
    toggleCashier: PropTypes.func,
    vertical_tab_index: PropTypes.number,
};

export default connect(({ modules, ui }) => ({
    disableRouteMode: ui.disableRouteModal,
    enableRouteMode: ui.setRouteModal,
    is_p2p_visible: modules.cashier.is_p2p_visible,
    is_visible: ui.is_cashier_visible,
    is_payment_agent_visible: !!(
        modules.cashier.config.payment_agent.filtered_list.length || modules.cashier.config.payment_agent.agents.length
    ),
    is_payment_agent_transfer_visible: modules.cashier.config.payment_agent_transfer.is_payment_agent,
    onMount: modules.cashier.onMountCommon,
    p2p_notification_count: modules.cashier.p2p_notification_count,
    setVerticalTabIndex: ui.setVerticalTabIndex,
    toggleCashier: ui.toggleCashier,
    vertical_tab_index: ui.vertical_tab_index,
}))(withRouter(Cashier));

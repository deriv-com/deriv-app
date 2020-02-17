import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { PageOverlay, VerticalTab } from '@deriv/components';
import { localize } from '@deriv/translations';
import { FadeWrapper } from 'App/Components/Animations';
import routes from 'Constants/routes';
import { connect } from 'Stores/connect';

class Cashier extends React.Component {
    componentDidMount() {
        this.props.toggleCashier();
        // we still need to populate the tabs shown on cashier
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
        this.props.toggleCashier();
    }

    onClickClose = () => this.props.routeBackInApp(this.props.history);

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
                        has_side_note: route.path !== routes.cashier_p2p, // Set to true to create the 3-column effect without passing any content. If there is content, the content should be passed in.
                    });
                }
            });

            return options;
        };

        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='cashier-page-wrapper'
                keyname='cashier-page-wrapper'
            >
                <div className='cashier'>
                    <PageOverlay header={localize('Cashier')} onClickClose={this.onClickClose} has_side_note>
                        <VerticalTab
                            alignment='center'
                            id='cashier'
                            classNameHeader='cashier__tab-header'
                            current_path={this.props.location.pathname}
                            is_floating
                            is_full_width
                            is_routed
                            list={menu_options()}
                        />
                    </PageOverlay>
                </div>
            </FadeWrapper>
        );
    }
}

Cashier.propTypes = {
    history: PropTypes.object,
    is_p2p_visible: PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    p2p_notification_count: PropTypes.number,
    routes: PropTypes.arrayOf(PropTypes.object),
    toggleCashier: PropTypes.func,
};

export default connect(({ common, modules, ui }) => ({
    routeBackInApp: common.routeBackInApp,
    is_p2p_visible: modules.cashier.is_p2p_visible,
    is_visible: ui.is_cashier_visible,
    is_payment_agent_visible: modules.cashier.is_payment_agent_visible,
    is_payment_agent_transfer_visible: modules.cashier.is_payment_agent_transfer_visible,
    onMount: modules.cashier.onMountCommon,
    onUnmount: modules.cashier.onUnmount,
    p2p_notification_count: modules.cashier.p2p_notification_count,
    toggleCashier: ui.toggleCashier,
}))(withRouter(Cashier));

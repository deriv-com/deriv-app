import React from 'react';
import { withRouter } from 'react-router-dom';
import { AutoHeightWrapper, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import DemoMessage from 'Components/demo-message';
import MissingPersonalDetails from 'Components/poi-missing-personal-details';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';

class ProofOfIdentity extends React.Component {
    state = {
        should_show_redirect_btn: false,
        redirect_text: '',
        redirect_route: '',
    };

    componentDidMount() {
        const route_to_item = this.props.app_routing_history.find((history_item) => {
            if (history_item.action === 'PUSH') {
                const platform_parent_paths = [routes.mt5, routes.bot, routes.trade, routes.cashier_p2p];

                if (platform_parent_paths.includes(history_item.pathname)) {
                    return true;
                }
            }

            return false;
        });

        if (route_to_item && route_to_item.pathname === routes.cashier_p2p) {
            this.setState({
                should_show_redirect_btn: true,
                redirect_text: localize('Back to P2P'),
                redirect_route: routes.cashier_p2p,
            });
        }
    }

    routeBackTo = () => {
        if (this.state.should_show_redirect_btn) {
            this.props.routeBackInApp(this.props.history, [this.state.redirect_route]);
        }
    };

    render() {
        if (this.props.is_virtual) return <DemoMessage />;
        if (this.props.has_missing_required_field) return <MissingPersonalDetails />;

        return (
            <AutoHeightWrapper default_height={200}>
                {({ setRef, height }) => (
                    <div ref={setRef} className='proof-of-identity'>
                        <ProofOfIdentityContainer
                            serviceToken={WS.serviceToken}
                            notificationEvent={WS.notificationEvent}
                            getAccountStatus={WS.authorized.getAccountStatus}
                            addNotificationByKey={this.props.addNotificationByKey}
                            removeNotificationByKey={this.props.removeNotificationByKey}
                            removeNotificationMessage={this.props.removeNotificationMessage}
                            refreshNotifications={this.props.refreshNotifications}
                            height={height}
                            redirectButton={
                                this.state.should_show_redirect_btn && (
                                    <Button primary onClick={this.routeBackTo}>
                                        {this.state.redirect_text}
                                    </Button>
                                )
                            }
                        />
                    </div>
                )}
            </AutoHeightWrapper>
        );
    }
}

export default connect(({ client, ui, common }) => ({
    has_missing_required_field: client.has_missing_required_field,
    is_virtual: client.is_virtual,
    refreshNotifications: client.refreshNotifications,
    addNotificationByKey: ui.addNotificationMessageByKey,
    removeNotificationByKey: ui.removeNotificationByKey,
    removeNotificationMessage: ui.removeNotificationMessage,
    routeBackInApp: common.routeBackInApp,
    app_routing_history: common.app_routing_history,
}))(withRouter(ProofOfIdentity));

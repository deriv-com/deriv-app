import React from 'react';
import { withRouter } from 'react-router-dom';
import { AutoHeightWrapper, Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getPlatformRedirect, useIsMounted } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import DemoMessage from 'Components/demo-message';
import MissingPersonalDetails from 'Components/poi-missing-personal-details';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';

const ProofOfIdentity = ({
    account_status,
    addNotificationByKey,
    app_routing_history,
    has_missing_required_field,
    history,
    is_mx_mlt,
    is_virtual,
    refreshNotifications,
    removeNotificationByKey,
    removeNotificationMessage,
    routeBackInApp,
    should_allow_authentication,
}) => {
    const isMounted = useIsMounted();
    const from_platform = getPlatformRedirect(app_routing_history);
    const should_show_redirect_btn = from_platform.name === 'P2P';

    const routeBackTo = redirect_route => routeBackInApp(history, [redirect_route]);

    React.useEffect(() => {
        if (isMounted) {
            WS.wait('get_account_status').then(() => {
                if (!should_allow_authentication) {
                    routeBackInApp(history, [from_platform]);
                }
            });
        }
    }, [from_platform, history, isMounted, routeBackInApp, should_allow_authentication]);

    if (is_virtual) return <DemoMessage />;
    if (has_missing_required_field) return <MissingPersonalDetails />;

    return (
        <AutoHeightWrapper default_height={200}>
            {({ setRef, height }) => (
                <div ref={setRef} className='proof-of-identity'>
                    <ProofOfIdentityContainer
                        account_status={account_status}
                        serviceToken={WS.serviceToken}
                        notificationEvent={WS.notificationEvent}
                        getAccountStatus={WS.authorized.getAccountStatus}
                        addNotificationByKey={addNotificationByKey}
                        is_mx_mlt={is_mx_mlt}
                        removeNotificationByKey={removeNotificationByKey}
                        removeNotificationMessage={removeNotificationMessage}
                        refreshNotifications={refreshNotifications}
                        height={height}
                        redirect_button={
                            should_show_redirect_btn && (
                                <Button
                                    primary
                                    className='proof-of-identity__redirect'
                                    onClick={() => routeBackTo(from_platform.route)}
                                >
                                    <Localize
                                        i18n_default_text='Back to {{platform_name}}'
                                        values={{ platform_name: from_platform.name }}
                                    />
                                </Button>
                            )
                        }
                        is_description_enabled
                    />
                </div>
            )}
        </AutoHeightWrapper>
    );
};

export default connect(({ client, ui, common }) => ({
    account_status: client.account_status,
    has_missing_required_field: client.has_missing_required_field,
    is_virtual: client.is_virtual,
    is_mx_mlt: client.landing_company_shortcode === 'iom' || client.landing_company_shortcode === 'malta',
    refreshNotifications: client.refreshNotifications,
    addNotificationByKey: ui.addNotificationMessageByKey,
    removeNotificationByKey: ui.removeNotificationByKey,
    removeNotificationMessage: ui.removeNotificationMessage,
    routeBackInApp: common.routeBackInApp,
    app_routing_history: common.app_routing_history,
    should_allow_authentication: client.should_allow_authentication,
}))(withRouter(ProofOfIdentity));

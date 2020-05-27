import React from 'react';
import { AutoHeightWrapper } from '@deriv/components';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import DemoMessage from 'Components/demo-message';
import MissingPersonalDetails from 'Components/poi-missing-personal-details';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';

class ProofOfIdentity extends React.Component {
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
                        />
                    </div>
                )}
            </AutoHeightWrapper>
        );
    }
}

export default connect(({ client, ui }) => ({
    has_missing_required_field: client.has_missing_required_field,
    is_virtual: client.is_virtual,
    refreshNotifications: client.refreshNotifications,
    addNotificationByKey: ui.addNotificationMessageByKey,
    removeNotificationByKey: ui.removeNotificationByKey,
    removeNotificationMessage: ui.removeNotificationMessage,
}))(ProofOfIdentity);

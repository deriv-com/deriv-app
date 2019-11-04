import React                      from 'react';
import { connect }                from 'Stores/connect';
import ProofOfIdentityContainer   from './proof-of-identity-container.jsx';
import { MissingPersonalDetails } from './proof-of-identity-messages.jsx';
import DemoMessage                from '../../ErrorMessages/DemoMessage';

class ProofOfIdentity extends React.Component {
    render() {
        if (this.props.is_virtual) return <DemoMessage />;
        if (this.props.has_missing_required_field) return <MissingPersonalDetails />;

        return (
            <ProofOfIdentityContainer
                addNotificationByKey={this.props.addNotificationByKey}
                removeNotificationByKey={this.props.removeNotificationByKey}
                removeNotificationMessage={this.props.removeNotificationMessage}
                refreshNotifications={this.props.refreshNotifications}
            />
        );
    }
}

export default connect(
    ({ client, ui }) => ({
        has_missing_required_field: client.has_missing_required_field,
        is_virtual                : client.is_virtual,
        refreshNotifications      : client.refreshNotifications,
        addNotificationByKey      : ui.addNotificationMessageByKey,
        removeNotificationByKey   : ui.removeNotificationByKey,
        removeNotificationMessage : ui.removeNotificationMessage,
    }),
)(ProofOfIdentity);

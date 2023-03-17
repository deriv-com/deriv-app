import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'Stores/connect';
import ProofOfOwnershipForm from './proof-of-ownership-form.jsx';
import { POONotRequired, POOVerified, POORejetced, POOSubmitted } from 'Components/poo/statuses';
import { Loading } from '@deriv/components';
import { POO_STATUSES } from './constants/constants';
import paymentMethodConfig from './payment-method-config.js';

export const ProofOfOwnership = ({
    account_status,
    client_email,
    is_dark_mode,
    refreshNotifications,
    updateAccountStatus,
}) => {
    const cards = account_status?.authentication?.ownership?.requests;
    const [status, setStatus] = useState(POO_STATUSES.none);
    const grouped_payment_method_data = React.useMemo(() => {
        const groups = {};
        cards?.forEach(card => {
            const card_details = paymentMethodConfig[card.payment_method.toLowerCase()] || paymentMethodConfig.other;
            if (groups[card?.payment_method?.toLowerCase()]) {
                groups[card?.payment_method?.toLowerCase()].items.push(card);
            } else {
                groups[card?.payment_method?.toLowerCase()] = {
                    documents_required: card?.documents_required,
                    icon: is_dark_mode ? card_details?.icon_dark : card_details?.icon_light,
                    payment_method: card?.payment_method,
                    items: [card],
                    instructions: card_details.instructions,
                    input_label: card_details?.input_label,
                    identifier_type: card_details.identifier_type,
                    is_generic_pm: !card_details?.input_label,
                };
            }
        });
        return { groups };
    }, [cards, is_dark_mode]);
    useEffect(() => {
        setStatus(account_status?.authentication?.ownership?.status?.toLowerCase());
    }, [account_status]);
    const onTryAgain = () => {
        setStatus(POO_STATUSES.none);
    };
    if (cards?.length > 0 && status !== POO_STATUSES.rejected) {
        return (
            <ProofOfOwnershipForm
                grouped_payment_method_data={grouped_payment_method_data.groups}
                updateAccountStatus={updateAccountStatus}
                refreshNotifications={refreshNotifications}
                client_email={client_email}
            />
        ); // Proof of ownership is required.
    }
    if (status === POO_STATUSES.verified) {
        return <POOVerified />; // Proof of ownership verified
    }
    if (status === POO_STATUSES.pending) {
        return <POOSubmitted />; // Proof of ownership submitted pending review
    }
    if (status === POO_STATUSES.none) {
        return <POONotRequired />; // Client does not need proof of ownership.
    }
    if (status === POO_STATUSES.rejected) {
        return <POORejetced onTryAgain={onTryAgain} />; // Proof of ownership rejected
    }
    return <Loading is_fullscreen={false} className='account__initial-loader' />;
};

export default connect(({ client, notifications, ui }) => ({
    account_status: client.account_status,
    client_email: client.email,
    is_dark_mode: ui.is_dark_mode_on,
    refreshNotifications: notifications.refreshNotifications,
    updateAccountStatus: client.updateAccountStatus,
}))(withRouter(ProofOfOwnership));

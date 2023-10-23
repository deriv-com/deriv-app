import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GetAccountStatus } from '@deriv/api-types';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import ProofOfOwnershipForm from './proof-of-ownership-form';
import { POONotRequired, POOVerified, POORejetced, POOSubmitted } from 'Components/poo/statuses';
import { POO_STATUSES } from 'Constants/poo-identifier';
import getPaymentMethodsConfig from '../../../Configs/payment-method-config';
import { TPaymentMethod, TPaymentMethodIdentifier, TPaymentMethodInfo } from 'Types';

export const ProofOfOwnership = observer(() => {
    const { client, notifications, ui } = useStore();
    const { account_status, email: client_email, updateAccountStatus } = client;
    const { is_dark_mode_on: is_dark_mode, is_mobile } = ui;
    const { refreshNotifications } = notifications;
    const cards = account_status?.authentication?.ownership
        ?.requests as DeepRequired<GetAccountStatus>['authentication']['ownership']['requests'];
    const [status, setStatus] = useState(POO_STATUSES.NONE);

    const grouped_payment_method_data = React.useMemo(() => {
        const groups: Partial<Record<TPaymentMethod, TPaymentMethodInfo>> = {};
        const payment_methods_config = getPaymentMethodsConfig();
        cards?.forEach(card => {
            const card_payment_method = card?.payment_method?.toLowerCase() || '';
            const card_details =
                payment_methods_config[card_payment_method as TPaymentMethod] || payment_methods_config.other;

            if (groups[card_payment_method as TPaymentMethod]) {
                groups[card_payment_method as TPaymentMethod]?.items?.push(card);
            } else {
                groups[card_payment_method as TPaymentMethod] = {
                    documents_required: card?.documents_required,
                    icon: is_dark_mode ? card_details?.icon_dark : card_details?.icon_light,
                    payment_method: card?.payment_method,
                    items: [card],
                    instructions: card_details.instructions,
                    input_label: card_details?.input_label,
                    identifier_type: card_details.identifier_type as TPaymentMethodIdentifier,
                    is_generic_pm: !card_details?.input_label,
                };
            }
        });
        return { groups };
    }, [cards, is_dark_mode]);
    useEffect(() => {
        setStatus(account_status?.authentication?.ownership?.status?.toLowerCase() || '');
    }, [account_status]);
    const onTryAgain = () => {
        setStatus(POO_STATUSES.NONE);
    };

    if (cards?.length > 0 && status !== POO_STATUSES.REJECTED) {
        return (
            <ProofOfOwnershipForm
                client_email={client_email}
                grouped_payment_method_data={grouped_payment_method_data.groups}
                is_mobile={is_mobile}
                refreshNotifications={refreshNotifications}
                updateAccountStatus={updateAccountStatus}
            />
        ); // Proof of ownership is required.
    }
    if (status === POO_STATUSES.VERIFIED) {
        return <POOVerified />; // Proof of ownership verified
    }
    if (status === POO_STATUSES.PENDING) {
        return <POOSubmitted />; // Proof of ownership submitted pending review
    }
    if (status === POO_STATUSES.NONE) {
        return <POONotRequired />; // Client does not need proof of ownership.
    }
    if (status === POO_STATUSES.REJECTED) {
        return <POORejetced onTryAgain={onTryAgain} />; // Proof of ownership rejected
    }
    return <Loading is_fullscreen={false} className='account__initial-loader' />;
});

export default withRouter(ProofOfOwnership);

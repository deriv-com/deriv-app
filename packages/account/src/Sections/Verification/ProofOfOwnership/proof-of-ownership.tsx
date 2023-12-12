import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GetAccountStatus } from '@deriv/api-types';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { AUTH_STATUS_CODES } from '@deriv/shared';
import ProofOfOwnershipForm from './proof-of-ownership-form';
import { POONotRequired, POOVerified, POORejetced, POOSubmitted } from '../../../Components/poo/statuses';
import getPaymentMethodsConfig from '../../../Configs/payment-method-config';
import { TPaymentMethod, TPaymentMethodIdentifier, TPaymentMethodInfo, TAuthStatusCodes } from '../../../Types';

type TPaymentData = DeepRequired<GetAccountStatus>['authentication']['ownership']['requests'];

export const ProofOfOwnership = observer(() => {
    const { client, notifications, ui } = useStore();
    const { account_status, email: client_email, updateAccountStatus } = client;
    const { is_dark_mode_on: is_dark_mode, is_mobile } = ui;
    const { refreshNotifications } = notifications;
    const cards = account_status?.authentication?.ownership?.requests;
    const [status, setStatus] = useState<TAuthStatusCodes>(AUTH_STATUS_CODES.NONE);

    const grouped_payment_method_data = React.useMemo(() => {
        const groups: Partial<Record<TPaymentMethod, TPaymentMethodInfo>> = {};
        const payment_methods_config = getPaymentMethodsConfig();
        cards?.forEach(card => {
            const card_payment_method = card?.payment_method?.toLowerCase();
            const card_details =
                payment_methods_config[card_payment_method as TPaymentMethod] || payment_methods_config.other;

            if (groups[card_payment_method as TPaymentMethod]) {
                groups[card_payment_method as TPaymentMethod]?.items?.push(card as TPaymentData[number]);
            } else {
                groups[card_payment_method as TPaymentMethod] = {
                    documents_required: (card as TPaymentData[number])?.documents_required,
                    icon: is_dark_mode ? card_details?.icon_dark : card_details?.icon_light,
                    payment_method: (card as TPaymentData[number])?.payment_method,
                    items: [card as TPaymentData[number]],
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
        setStatus(
            (account_status?.authentication?.ownership?.status?.toLowerCase() as TAuthStatusCodes) ??
                AUTH_STATUS_CODES.NONE
        );
    }, [account_status]);
    const onTryAgain = () => {
        setStatus(AUTH_STATUS_CODES.NONE);
    };

    if (cards?.length && status !== AUTH_STATUS_CODES.REJECTED) {
        return (
            <ProofOfOwnershipForm
                client_email={client_email}
                grouped_payment_method_data={grouped_payment_method_data.groups}
                is_mobile={is_mobile}
                refreshNotifications={refreshNotifications}
                updateAccountStatus={updateAccountStatus}
            />
        );
    }
    if (status === AUTH_STATUS_CODES.VERIFIED) return <POOVerified />;
    if (status === AUTH_STATUS_CODES.PENDING) return <POOSubmitted />;
    if (status === AUTH_STATUS_CODES.NONE) return <POONotRequired />;
    if (status === AUTH_STATUS_CODES.REJECTED) return <POORejetced onTryAgain={onTryAgain} />;
    return <Loading is_fullscreen={false} className='account__initial-loader' />;
});

export default withRouter(ProofOfOwnership);

import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GetAccountStatus } from '@deriv/api-types';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { AUTH_STATUS_CODES } from '@deriv/shared';
import ProofOfOwnershipForm from './proof-of-ownership-form';
import getPaymentMethodsConfig from '../../../Configs/payment-method-config';
import { TPaymentMethod, TPaymentMethodIdentifier, TPaymentMethodInfo } from '../../../Types';
import { getPOOStatusMessages, TPooStatus } from 'Sections/Verification/ProofOfOwnership/proof-of-ownership-configs';
import VerificationStatus from '../../../Components/verification-status/verification-status';

type TPaymentData = DeepRequired<GetAccountStatus>['authentication']['ownership']['requests'];

export const ProofOfOwnership = observer(() => {
    const { client, ui } = useStore();
    const { account_status } = client;
    const { is_dark_mode_on: is_dark_mode, is_mobile } = ui;
    const cards = account_status?.authentication?.ownership?.requests;
    const [status, setStatus] = useState<TPooStatus>(AUTH_STATUS_CODES.NONE);
    const [is_loading, setIsLoading] = React.useState(true);

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
        setStatus(account_status?.authentication?.ownership?.status?.toLowerCase() as TPooStatus);
        setIsLoading(false);
    }, [account_status]);

    const onTryAgain = () => {
        setStatus(AUTH_STATUS_CODES.NONE);
    };
    const status_content = getPOOStatusMessages(status);

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;

    if (cards?.length && status !== AUTH_STATUS_CODES.REJECTED) {
        return <ProofOfOwnershipForm grouped_payment_method_data={grouped_payment_method_data.groups} />;
    }
    return (
        <VerificationStatus
            icon={status_content.icon}
            is_mobile={is_mobile}
            status_description={status_content.description}
            status_title={status_content.title}
        >
            {status_content.action_button?.({ onClick: onTryAgain })}
        </VerificationStatus>
    );
});

ProofOfOwnership.displayName = 'ProofOfOwnership';

export default withRouter(ProofOfOwnership);

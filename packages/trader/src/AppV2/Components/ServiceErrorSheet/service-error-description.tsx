import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';

type ServiceErrorProps = {
    is_insufficient_balance: boolean;
    is_authorization_required: boolean;
    is_account_verification_required: boolean;
    is_mf_verification_pending_modal_visible: boolean;
    services_error_message?: string;
};

const ServiceErrorDescription: React.FC<ServiceErrorProps> = ({
    is_insufficient_balance,
    is_authorization_required,
    is_account_verification_required,
    is_mf_verification_pending_modal_visible,
    services_error_message,
}) => {
    if (is_insufficient_balance) {
        return (
            <>
                <Text size='lg' bold className='service-error-sheet__body__heading'>
                    <Localize i18n_default_text='Insufficient balance' />
                </Text>
                <Text>{services_error_message || <Localize i18n_default_text='An error occurred.' />}</Text>
            </>
        );
    }

    if (is_authorization_required) {
        return (
            <>
                <Text size='lg' bold className='service-error-sheet__body__heading'>
                    <Localize i18n_default_text='Start trading with us' />
                </Text>
                <Text>
                    <Localize i18n_default_text='Log in or create a free account to place a trade.' />
                </Text>
            </>
        );
    }

    if (is_account_verification_required) {
        return (
            <>
                <Text size='lg' bold className='service-error-sheet__body__heading'>
                    <Localize i18n_default_text='Account verification required' />
                </Text>
                <Text>
                    <Localize i18n_default_text='Please submit your proof of identity and proof of address to verify your account and continue trading.' />
                </Text>
            </>
        );
    }

    if (is_mf_verification_pending_modal_visible) {
        return (
            <>
                <Text size='lg' bold className='service-error-sheet__body__heading'>
                    <Localize i18n_default_text='Pending verification' />
                </Text>
                <Text>
                    <Localize i18n_default_text='You cannot trade as your documents are still under review. We will notify you by email once your verification is approved.' />
                </Text>
            </>
        );
    }

    return null;
};

export default ServiceErrorDescription;

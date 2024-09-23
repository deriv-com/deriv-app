import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';

type ServiceErrorProps = {
    is_insufficient_balance: boolean;
    is_authorization_required: boolean;
    services_error: { message?: string };
};

const ServiceErrorDescription: React.FC<ServiceErrorProps> = ({
    is_insufficient_balance,
    is_authorization_required,
    services_error,
}) => {
    if (is_insufficient_balance) {
        return (
            <>
                <Text size='lg' bold className='service-error-sheet__body__heading'>
                    <Localize i18n_default_text='Insufficient balance' />
                </Text>
                <Text>{services_error?.message || <Localize i18n_default_text='An error occurred.' />}</Text>
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

    return null;
};

export default ServiceErrorDescription;

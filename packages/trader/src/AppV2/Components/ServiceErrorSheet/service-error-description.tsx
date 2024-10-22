import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';
import { SERVICE_ERROR } from 'AppV2/Utils/layout-utils';

type ServiceErrorProps = {
    error_type: string | null;
    services_error_message?: string;
};

const ServiceErrorDescription: React.FC<ServiceErrorProps> = ({ error_type, services_error_message }) => {
    const getContent = () => {
        switch (error_type) {
            case SERVICE_ERROR.INSUFFICIENT_BALANCE:
                return {
                    title: <Localize i18n_default_text='Insufficient balance' />,
                    text: services_error_message || <Localize i18n_default_text='An error occurred.' />,
                };
            case SERVICE_ERROR.AUTHORIZATION_REQUIRED:
                return {
                    title: <Localize i18n_default_text='Start trading with us' />,
                    text: <Localize i18n_default_text='Log in or create a free account to place a trade.' />,
                };
            case SERVICE_ERROR.PLEASE_AUTHENTICATE:
                return {
                    title: <Localize i18n_default_text='Account verification required' />,
                    text: (
                        <Localize i18n_default_text='Please submit your proof of identity and proof of address to verify your account and continue trading.' />
                    ),
                };
            case SERVICE_ERROR.PENDING_VERIFICATION:
                return {
                    title: <Localize i18n_default_text='Pending verification' />,
                    text: (
                        <Localize i18n_default_text='You cannot trade as your documents are still under review. We will notify you by email once your verification is approved.' />
                    ),
                };
            default:
                return {};
        }
    };
    const { title, text } = getContent() || {};

    return (
        <>
            <Text size='lg' bold className='service-error-sheet__body__heading'>
                {title}
            </Text>
            <Text>{text}</Text>
        </>
    );
};

export default ServiceErrorDescription;

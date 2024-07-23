import React from 'react';
import { TSocketError } from '@deriv/api-v2/types';
import { InlineMessage, WalletText } from '../../../../../../../../components';
import useDevice from '../../../../../../../../hooks/useDevice';

type TErrorMessageProps = {
    error: TSocketError<'get_settings'>['error']['code'] | TSocketError<'set_settings'>['error']['code'];
};

const ErrorMessage: React.FC<TErrorMessageProps> = ({ error }) => {
    const { isMobile } = useDevice();

    const handleOnClickLink = () => window.LC_API.open_chat_window();

    if (error === 'DuplicateAccount') {
        return (
            <InlineMessage size={isMobile ? 'md' : 'sm'} type='error'>
                <WalletText as='span'>
                    An account with these details already exists. Please make sure the details you entered are correct
                    as only one real account is allowed per client. If this is a mistake, contact us via{' '}
                    <a className='wallets-verify-personal-details__error-link' onClick={handleOnClickLink}>
                        live chat
                    </a>
                    .
                </WalletText>
            </InlineMessage>
        );
    }

    return (
        <InlineMessage>
            <WalletText as='span'>Sorry, an internal error occurred. Hit the above checkbox to try again.</WalletText>
        </InlineMessage>
    );
};

export default ErrorMessage;

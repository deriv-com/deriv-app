import React, { ReactNode } from 'react';
import { TSocketError } from '@deriv/api-v2/types';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { InlineMessage, WalletText } from '../../../../../../../../components';
import useDevice from '../../../../../../../../hooks/useDevice';

type TErrorMessageProps = {
    error: TSocketError<'set_settings'>['error'];
};

const settingsErrorMap: Record<string, ReactNode> = {
    DuplicateAccount: (
        <Localize
            components={[
                <button
                    className='wallets-link wallets-link__variant--bold'
                    key={0}
                    onClick={() => window.LC_API.open_chat_window()}
                />,
            ]}
            i18n_default_text='An account with these details already exists. Please make sure the details you entered are correct as only one real account is allowed per client. If this is a mistake, contact us via <0>live chat</0>.'
        />
    ),
    GenericMessage: (
        <Localize i18n_default_text='Sorry, an internal error occurred. Hit the above checkbox to try again.' />
    ),
};

const VerifyPersonalDetailsErrorMessage: React.FC<TErrorMessageProps> = ({ error }) => {
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-verify-personal-details-error-message'>
            <InlineMessage size={!isDesktop ? 'md' : 'sm'} type='error'>
                <Text as='span' size='sm'>
                    {
                        // Show custom error message for the provided error code (if any)
                        // else show the generic error message
                        settingsErrorMap[error.code] ?? settingsErrorMap.GenericMessage
                    }
                </Text>
            </InlineMessage>
        </div>
    );
};

export default VerifyPersonalDetailsErrorMessage;

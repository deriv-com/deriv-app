import React, { ReactNode } from 'react';
import { TSocketError } from '@deriv/api-v2/types';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { InlineMessage, WalletText } from '../../../../../../../components';
import useDevice from '../../../../../../../hooks/useDevice';
import './IDVServiceErrorMessage.scss';

const idvErrorMap: Record<string, ReactNode> = {
    ClaimedDocument: (
        <Localize
            components={[
                <button
                    className='wallets-link wallets-link__variant--bold'
                    key={0}
                    onClick={() => window.LC_API.open_chat_window()}
                />,
            ]}
            i18n_default_text="This document number was already submitted for a different account. It seems you have an account with us that doesn't need further verification. Please contact us via <0>live chat</0> if you need help."
        />
    ),
    GenericMessage: (
        <Localize i18n_default_text='Sorry, an internal error occurred. Hit the above checkbox to try again.' />
    ),
};

const IDVServiceErrorMessage = ({ error }: { error: TSocketError<'identity_verification_document_add'>['error'] }) => {
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-idv-service-error-message'>
            <WalletText weight='bold'>
                <Localize i18n_default_text='Your identity verification failed because:' />
            </WalletText>
            <InlineMessage size={!isDesktop ? 'md' : 'sm'} type='error'>
                <Text as='span' size='sm'>
                    {idvErrorMap[error.code] ?? error.message ?? idvErrorMap.GenericMessage}
                </Text>
            </InlineMessage>
            <WalletText size='sm'>
                <Localize i18n_default_text="Let's try again. Choose another document and enter the corresponding details." />
            </WalletText>
        </div>
    );
};

export default IDVServiceErrorMessage;

import React from 'react';
import { TSocketError } from '@deriv/api-v2/types';
import { Localize } from '@deriv-com/translations';
import { InlineMessage, WalletText } from '../../../../../../../../components';
import useDevice from '../../../../../../../../hooks/useDevice';

type TErrorMessageProps = {
    error: TSocketError<'get_settings'>['error']['code'] | TSocketError<'set_settings'>['error']['code'];
};

const VerifyPersonalDetailsErrorMessage: React.FC<TErrorMessageProps> = ({ error }) => {
    const { isDesktop } = useDevice();

    const handleOnClickLink = () => window.LC_API.open_chat_window();

    if (error === 'DuplicateAccount') {
        return (
            <InlineMessage size={!isDesktop ? 'md' : 'sm'} type='error'>
                <WalletText as='span'>
                    <Localize
                        components={[
                            <button
                                className='wallets-link wallets-link__variant--bold'
                                key={0}
                                onClick={handleOnClickLink}
                            />,
                        ]}
                        i18n_default_text='An account with these details already exists. Please make sure the details you entered are correct as only one real account is allowed per client. If this is a mistake, contact us via <0>live chat</0>.'
                    />
                </WalletText>
            </InlineMessage>
        );
    }

    return (
        <InlineMessage>
            <WalletText as='span'>
                <Localize i18n_default_text='Sorry, an internal error occurred. Hit the above checkbox to try again.' />
            </WalletText>
        </InlineMessage>
    );
};

export default VerifyPersonalDetailsErrorMessage;

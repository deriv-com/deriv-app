import React from 'react';
import { Div100vhContainer, Icon, SendEmailTemplate, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import ScrollbarsContainer from 'Components/scrollbars-container';

const ForgotYourPassword = ({ onClickSendEmail }) => (
    <ScrollbarsContainer>
        <Div100vhContainer
            className='account__scrollbars_container-wrapper'
            is_disabled={isDesktop()}
            height_offset='144px'
        >
            <SendEmailTemplate
                className='forgot-password'
                title={localize("We've sent you an email")}
                subtitle={localize('Please click on the link in the email to reset your password.')}
                lbl_no_receive={localize("Didn't receive the email?")}
                txt_resend={localize('Resend email')}
                txt_resend_in={localize('Resend email in {{seconds}}s', { seconds: '{{seconds}}' })}
                onClickSendEmail={onClickSendEmail}
            >
                <div className='forgot-password__content'>
                    <Icon icon='IcEmailSpam' size={32} />
                    <Text size='xxs' as='p'>
                        {localize('The email is in your spam folder (Sometimes things get lost there).')}
                    </Text>
                </div>
                <div className='forgot-password__content'>
                    <Icon icon='IcEmail' size={32} />
                    <Text size='xxs' as='p'>
                        {localize(
                            'You accidentally gave us another email address (Usually a work or a personal one instead of the one you meant).'
                        )}
                    </Text>
                </div>
                <div className='forgot-password__content'>
                    <Icon icon='IcEmailFirewall' size={32} />
                    <Text size='xxs' as='p'>
                        {localize(
                            'We can’t deliver the email to this address (Usually because of firewalls or filtering).'
                        )}
                    </Text>
                </div>
            </SendEmailTemplate>
        </Div100vhContainer>
    </ScrollbarsContainer>
);

export default ForgotYourPassword;

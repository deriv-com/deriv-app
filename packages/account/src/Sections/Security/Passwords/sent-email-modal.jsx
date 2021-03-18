import React from 'react';
import { Icon, Modal, SendEmailTemplate, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const SentEmailModal = ({ is_open, onClose }) => (
    // TODO dynamic subtitle
    <Modal is_open={is_open} title=' ' toggleModal={onClose} should_header_stick_body width='440px'>
        <Modal.Body>
            <SendEmailTemplate
                className='sent-email'
                title={localize('We’ve sent you an email')}
                subtitle={localize('Check your Google account email and click the link in the email to proceed. ')}
                lbl_no_receive={localize("Didn't receive the email?")}
                txt_resend={localize('Resend email')}
                txt_resend_in={localize('Resend email in {{seconds}}s', { seconds: '{{seconds}}' })}
            >
                <div className='sent-email__content'>
                    <Icon icon='IcEmailSpam' size={32} />
                    <Text size='xxs' as='p'>
                        {localize('The email is in your spam folder (Sometimes things get lost there).')}
                    </Text>
                </div>
                <div className='sent-email__content'>
                    <Icon icon='IcEmail' size={32} />
                    <Text size='xxs' as='p'>
                        {localize(
                            'You accidentally gave us another email address (Usually a work or a personal one instead of the one you meant).'
                        )}
                    </Text>
                </div>
                <div className='sent-email__content'>
                    <Icon icon='IcEmailFirewall' size={32} />
                    <Text size='xxs' as='p'>
                        {localize(
                            'We can’t deliver the email to this address (Usually because of firewalls or filtering).'
                        )}
                    </Text>
                </div>
            </SendEmailTemplate>
        </Modal.Body>
    </Modal>
);

export default SentEmailModal;

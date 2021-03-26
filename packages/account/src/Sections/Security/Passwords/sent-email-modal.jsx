import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, SendEmailTemplate, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const no_email_content = [
    {
        icon: 'IcEmailSpam',
        content: localize('The email is in your spam folder (Sometimes things get lost there).'),
    },
    {
        icon: 'IcEmail',
        content: localize(
            'You accidentally gave us another email address (Usually a work or a personal one instead of the one you meant).'
        ),
    },
    {
        icon: 'IcEmailFirewall',
        content: localize('We can’t deliver the email to this address (Usually because of firewalls or filtering).'),
    },
];

const SentEmailModal = ({ identifier_title, is_open, onClose }) => {
    const getSubtitle = () => {
        let subtitle = '';
        switch (identifier_title) {
            case 'trading_password':
                subtitle = localize('Please click on the link in the email to reset your trading password.');
                break;
            case 'Google':
            case 'Facebook':
                subtitle = localize(
                    `Check your ${identifier_title} account email and click the link in the email to proceed.`
                );
                break;
            default:
                subtitle = localize('Please click on the link in the email to reset your password.');
                break;
        }
        return subtitle;
    };

    return (
        <Modal
            className='sent-email__modal'
            is_open={is_open}
            should_header_stick_body
            toggleModal={onClose}
            width='440px'
        >
            <Modal.Body>
                <div onClick={onClose} className='sent-email__modal-close'>
                    <Icon icon='IcCross' />
                </div>
                <SendEmailTemplate
                    className='sent-email'
                    title={localize('We’ve sent you an email')}
                    subtitle={getSubtitle()}
                    lbl_no_receive={localize("Didn't receive the email?")}
                    txt_resend={localize('Resend email')}
                    txt_resend_in={localize('Resend email in {{seconds}}s', { seconds: '{{seconds}}' })}
                >
                    {no_email_content.map((item, idx) => (
                        <div className='sent-email__content' key={idx}>
                            <Icon icon={item.icon} size={32} />
                            <Text size='xxs' as='p'>
                                {item.content}
                            </Text>
                        </div>
                    ))}
                </SendEmailTemplate>
            </Modal.Body>
        </Modal>
    );
};

SentEmailModal.propTypes = {
    identifier_title: PropTypes.string,
    is_open: PropTypes.bool,
    onClose: PropTypes.func,
};

export default SentEmailModal;

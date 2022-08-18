import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Loading, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

const EmailVerificationModal = ({
    email_address,
    is_email_verification_modal_open,
    is_verifying = false,
    onClickResendEmailButton,
    remaining_time,
    setIsEmailVerificationModalOpen,
    should_show_resend_email_button = false,
    verification_link_expiry_time,
}) => {
    const [should_show_reasons_if_no_email, setShouldShowReasonsIfNoEmail] = React.useState(false);

    if (is_verifying) {
        return (
            <Modal has_close_icon={false} small width='440px'>
                <Loading is_fullscreen={false} />
            </Modal>
        );
    }

    return (
        <Modal
            has_close_icon
            is_open={is_email_verification_modal_open}
            title=''
            toggleModal={() => setIsEmailVerificationModalOpen(false)}
            width='440px'
        >
            <Modal.Body className='email-verification-modal'>
                <Icon icon='IcEmailSentP2p' size='128' />
                <Text
                    align='center'
                    className='email-verification-modal--email_text'
                    color='prominent'
                    size='s'
                    weight='bold'
                >
                    <Localize
                        i18n_default_text="We've sent you an email at {{email_address}}.<0 />Please click the verification link in the email to verify your order."
                        components={[<br key={0} />]}
                        values={{ email_address }}
                    />
                </Text>
                <Text color='prominent' size='s'>
                    <Localize
                        i18n_default_text='The verification link expires in {{verification_link_expiry_time}} minutes'
                        values={{ verification_link_expiry_time }}
                    />
                </Text>
                <Text
                    className='email-verification-modal--receive_email_text'
                    color='loss-danger'
                    onClick={() => setShouldShowReasonsIfNoEmail(true)}
                    size='xs'
                    weight='bold'
                >
                    <Localize i18n_default_text="Didn't receive the email?" />
                </Text>
                {should_show_reasons_if_no_email && (
                    <React.Fragment>
                        <div className='email-verification-modal--reason'>
                            <Icon icon='IcEmailSpam' size={36} />
                            <Text className='email-verification-modal--reason__text' color='prominent' size='xxs'>
                                <Localize i18n_default_text='The email is in your spam folder (sometimes things get lost there).' />
                            </Text>
                        </div>
                        <div className='email-verification-modal--reason'>
                            <Icon icon='IcEmail' size={36} />
                            <Text className='email-verification-modal--reason__text' color='prominent' size='xxs'>
                                <Localize i18n_default_text='You accidentally gave us another email address (usually a work or a personal one instead of the one you meant).' />
                            </Text>
                        </div>
                        <div className='email-verification-modal--reason'>
                            <Icon icon='IcEmailTypo' size={36} />
                            <Text className='email-verification-modal--reason__text' color='prominent' size='xxs'>
                                <Localize i18n_default_text='The email address you entered had a mistake or typo (happens to the best of us).' />
                            </Text>
                        </div>
                        <div className='email-verification-modal--reason'>
                            <Icon icon='IcEmailFirewall' size={36} />
                            <Text className='email-verification-modal--reason__text' color='prominent' size='xxs'>
                                <Localize i18n_default_text="We can't deliver the email to this address (usually because of firewalls or filtering)." />
                            </Text>
                        </div>
                    </React.Fragment>
                )}
            </Modal.Body>
            {should_show_resend_email_button && (
                <Modal.Footer>
                    <Button large primary onClick={onClickResendEmailButton}>
                        <Localize i18n_default_text='Resend email {{remaining_time}}' values={{ remaining_time }} />
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

EmailVerificationModal.propTypes = {
    email_address: PropTypes.string,
    is_email_verification_modal_open: PropTypes.bool,
    is_verifying: PropTypes.bool,
    onClickResendEmailButton: PropTypes.func,
    remaining_time: PropTypes.string,
    setIsEmailVerificationModalOpen: PropTypes.func,
    should_show_resend_email_button: PropTypes.bool,
    verification_link_expiry_time: PropTypes.number,
};

export default EmailVerificationModal;

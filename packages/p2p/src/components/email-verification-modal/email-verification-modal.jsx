import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';

const EmailVerificationModal = ({
    email_address,
    is_email_verification_modal_open,
    onClickResendEmailButton,
    setIsEmailVerificationModalOpen,
    should_show_resend_email_button = true,
    // TODO: Uncomment when time is available in BE response
    // remaining_time,
    // verification_link_expiry_time,
}) => {
    const [should_show_reasons_if_no_email, setShouldShowReasonsIfNoEmail] = React.useState(false);

    return (
        <Modal
            className='email-verification-modal'
            has_close_icon
            is_open={is_email_verification_modal_open}
            renderTitle={() => <></>}
            toggleModal={() => setIsEmailVerificationModalOpen(false)}
            width='440px'
        >
            <Modal.Body className='email-verification-modal--body'>
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
                <Text align='center' color='prominent' size='s'>
                    {/* TODO: Uncomment when time is available in BE response */}
                    <Localize i18n_default_text='The verification link expires in 10 minutes' />
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
            {should_show_resend_email_button && should_show_reasons_if_no_email && (
                <Modal.Footer className='email-verification-modal--footer'>
                    <Button large primary onClick={onClickResendEmailButton}>
                        <Localize i18n_default_text='Resend email' />
                        {/* TODO: Uncomment when time is available in BE response
                        <Localize i18n_default_text='Resend email {{remaining_time}}' values={{ remaining_time }} /> */}
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

EmailVerificationModal.propTypes = {
    email_address: PropTypes.string,
    is_email_verification_modal_open: PropTypes.bool,
    onClickResendEmailButton: PropTypes.func,
    // TODO: Uncomment when time is available in BE response
    // remaining_time: PropTypes.string,
    setIsEmailVerificationModalOpen: PropTypes.func,
    should_show_resend_email_button: PropTypes.bool,
    // TODO: Uncomment when time is available in BE response
    // verification_link_expiry_time: PropTypes.number,
};

export default EmailVerificationModal;

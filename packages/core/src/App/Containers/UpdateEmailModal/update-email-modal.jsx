import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'Stores/connect';
import { Button, Modal, Text, Icon, Loading } from '@deriv/components';
import { localize, Localize, getLanguage } from '@deriv/translations';
import { redirectToLogin } from '@deriv/shared';
import { WS } from 'Services';

const UpdateEmailModal = ({
    is_visible,
    toggleUpdateEmailModal,
    logoutClient,
    new_email,
    verification_code,
    is_logged_in,
}) => {
    const [is_email_updated, setIsEmailUpdated] = React.useState(false);
    const [update_email_error, setUpdateEmailMessage] = React.useState(null);

    const api_request = {
        change_email: 'update',
        new_email,
        verification_code,
    };

    const sendUpdateEmail = () => {
        WS.changeEmail(api_request).then(response => {
            setIsEmailUpdated(true);
            if (response.error) {
                setUpdateEmailMessage(response.error.message);
                logoutClient();
            }
        });
    };

    React.useEffect(() => {
        if (is_logged_in) {
            WS.wait('authorize').then(() => {
                sendUpdateEmail();
            });
            return;
        }
        sendUpdateEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal
            is_open={is_visible}
            has_close_icon={false}
            toggleModal={toggleUpdateEmailModal}
            width='440px'
            minHeight='400px'
        >
            {is_email_updated ? (
                <div className='change-email-update'>
                    {!update_email_error && (
                        <Icon className='change-email-update__modal-icon' icon={`IcEmailVerified`} size={128} />
                    )}
                    <Text className='change-email-update__modal-title' weight='bold' size='s'>
                        <Localize i18n_default_text={!update_email_error ? 'Success!' : 'Failed'} />
                    </Text>
                    <Text className='change-email-update__modal-description' size='xs'>
                        <Localize
                            i18n_default_text={
                                !update_email_error
                                    ? 'Your email address has changed.<0 />Now, log in with your new email address.'
                                    : update_email_error
                            }
                            components={[<br key={0} />]}
                        />
                    </Text>
                    <Modal.Footer className='change-email-update__footer'>
                        <Button
                            onClick={() => redirectToLogin(false, getLanguage())}
                            has_effect
                            text={localize('Log in')}
                            primary
                            large
                        />
                    </Modal.Footer>
                </div>
            ) : (
                <Loading is_fullscreen={false} />
            )}
        </Modal>
    );
};

UpdateEmailModal.prototypes = {
    toggleUpdateEmailModal: PropTypes.func,
    is_visible: PropTypes.bool,
    logoutClient: PropTypes.func,
    new_email: PropTypes.string,
    verification_code: PropTypes.string,
    is_logged_in: PropTypes.bool,
};

export default connect(({ ui, client }) => ({
    logoutClient: client.logout,
    is_visible: ui.is_update_email_modal_visible,
    toggleUpdateEmailModal: ui.toggleUpdateEmailModal,
    new_email: client.new_email.system_email_change,
    verification_code: client.verification_code.system_email_change,
    is_logged_in: client.is_logged_in,
}))(UpdateEmailModal);

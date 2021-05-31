import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Text, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import FormSubHeader from 'Components/form-sub-header';
import SentEmailModal from 'Components/sent-email-modal';
import ChangePasswordForm from './change-password-form.jsx';
import SetPasswordForm from './set-password-form.jsx';
import PasswordsStatic from './passwords-static.jsx';

const SuccessDialog = ({ onClose, is_open, is_dxtrade_allowed }) => {
    return (
        <Modal className='success-dialog' is_open={is_open} toggleModal={onClose} has_close_icon small>
            <Modal.Body>
                <div className='success-dialog__body'>
                    <div onClick={onClose} className='success-dialog__body-close'>
                        <Icon icon='IcCross' />
                    </div>
                    <Icon className='success-dialog__body-icon' icon='IcSuccessResetTradingPassword' size={128} />
                    <Text as='h2' weight='bold' size='s' className='dc-modal-header__title'>
                        <Localize i18n_default_text='Success' />
                    </Text>
                    {is_dxtrade_allowed ? (
                        <Localize i18n_default_text='You have successfully changed your trading password. Please use your new trading password to log in to your Deriv X and DMT5 accounts.' />
                    ) : (
                        <Localize i18n_default_text='You have successfully changed your trading password. Please use your new trading password to log in to your DMT5 accounts.' />
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect onClick={onClose} text={localize('Okay')} primary large />
            </Modal.Footer>
        </Modal>
    );
};

const TradingPassword = ({ email, is_trading_password_required, is_dxtrade_allowed }) => {
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);
    const [is_success_dialog_open, setIsSuccessDialogOpen] = React.useState(false);

    const onClickSendEmail = () => {
        WS.verifyEmail(email, 'trading_platform_password_reset');
        setIsSentEmailModalOpen(true);
    };

    return (
        <React.Fragment>
            <FormSubHeader title={localize('Trading password')} />
            <div className='account__passwords-wrapper'>
                <PasswordsStatic is_trading_password_required={is_trading_password_required} />
                {is_trading_password_required ? (
                    <SetPasswordForm />
                ) : (
                    <ChangePasswordForm
                        is_trading_password
                        onClickSendEmail={onClickSendEmail}
                        onPasswordChange={() => setIsSuccessDialogOpen(true)}
                    />
                )}
                <SentEmailModal
                    is_open={is_sent_email_modal_open}
                    identifier_title='trading_password'
                    onClose={() => setIsSentEmailModalOpen(false)}
                    onClickSendEmail={onClickSendEmail}
                />
                <SuccessDialog
                    is_open={is_success_dialog_open}
                    is_dxtrade_allowed={is_dxtrade_allowed}
                    onClose={() => setIsSuccessDialogOpen(false)}
                />
            </div>
        </React.Fragment>
    );
};

TradingPassword.propTypes = {
    email: PropTypes.string,
    is_trading_password_required: PropTypes.bool,
    is_dxtrade_allowed: PropTypes.bool,
};

export default connect(({ client }) => ({
    email: client.email,
    is_dxtrade_allowed: client.is_dxtrade_allowed,
}))(TradingPassword);

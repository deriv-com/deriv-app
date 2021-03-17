import React from 'react';
import PropTypes from 'prop-types';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import FormSubHeader from 'Components/form-sub-header';
import ChangePasswordForm from './change-password-form.jsx';
import PasswordsStatic from './passwords-static.jsx';

const TradingPassword = ({ email }) => (
    <React.Fragment>
        <FormSubHeader title={localize('Trading password')} />
        <div className='account__passwords-wrapper'>
            <PasswordsStatic />
            <ChangePasswordForm
                onClickSendEmail={() => {
                    WS.verifyEmail(email, 'reset_password');
                    // multi_step_ref.current?.goNextStep();
                }}
            />
        </div>
    </React.Fragment>
);

TradingPassword.propTypes = {
    email: PropTypes.string,
};

export default connect(({ client }) => ({
    email: client.email,
}))(TradingPassword);

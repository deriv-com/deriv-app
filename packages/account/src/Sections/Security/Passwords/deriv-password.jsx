import React from 'react';
import PropTypes from 'prop-types';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import FormSubHeader from 'Components/form-sub-header';
import ChangePasswordForm from './change-password-form.jsx';
import SocialPasswordForm from './social-password-form.jsx';
import PasswordsStatic from './passwords-static.jsx';

const DerivPassword = ({ email, is_social_signup }) => (
    <React.Fragment>
        <FormSubHeader title={localize('Deriv password')} />
        <div className='account__passwords-wrapper'>
            <PasswordsStatic is_deriv_password />
            {is_social_signup ? (
                <SocialPasswordForm />
            ) : (
                <ChangePasswordForm
                    onClickSendEmail={() => {
                        WS.verifyEmail(email, 'reset_password');
                        // multi_step_ref.current?.goNextStep();
                    }}
                />
            )}
        </div>
    </React.Fragment>
);

DerivPassword.propTypes = {
    email: PropTypes.string,
    is_social_signup: PropTypes.bool,
};

export default connect(({ client }) => ({
    email: client.email,
    is_social_signup: client.is_social_signup,
}))(DerivPassword);

import PropTypes from 'prop-types';
import React from 'react';
import { MultiStep } from '@deriv/components';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';
import ChangePasswordForm from './change-password-form.jsx';
import ForgotYourPassword from './forgot-your-password.jsx';

const DerivPassword = ({ email }) => {
    const multi_step_ref = React.useRef();
    const steps = [
        {
            component: (
                <ChangePasswordForm
                    onClickSendEmail={() => {
                        WS.verifyEmail(email, 'reset_password');
                        multi_step_ref.current?.goNextStep();
                    }}
                />
            ),
        },
        {
            component: (
                <ForgotYourPassword
                    onClickSendEmail={() => {
                        WS.verifyEmail(email, 'reset_password');
                    }}
                />
            ),
        },
    ];

    return <MultiStep ref={multi_step_ref} steps={steps} lbl_previous={localize('Back')} />;
};

DerivPassword.propTypes = {
    email: PropTypes.string,
};

export default connect(({ client }) => ({
    email: client.email,
}))(DerivPassword);

import React from 'react';
import { connect } from 'Stores/connect';
import RealAccountSignup from './real-account-signup-base.jsx';

const RealAccountSignupBase = ({
    is_real_acc_signup_on,
    is_logging_in,
    real_account_signup_target,
    setRealAccountSignupTarget,
    has_any_real_account,
}) => {
    const [show_real_account, setShowRealAccount] = React.useState(false);

    React.useEffect(() => {
        async function validateRealAccountTarget() {
            if (!is_real_acc_signup_on) return;

            if (!is_logging_in && !real_account_signup_target) {
                if (has_any_real_account) {
                    setRealAccountSignupTarget('manage');
                } else {
                    setRealAccountSignupTarget();
                }
            }

            if (!is_logging_in && real_account_signup_target) {
                setShowRealAccount(true);
            }
        }

        validateRealAccountTarget();
    }, [
        is_logging_in,
        real_account_signup_target,
        setRealAccountSignupTarget,
        has_any_real_account,
        is_real_acc_signup_on,
    ]);

    return show_real_account && <RealAccountSignup />;
};

export default connect(({ client, ui }) => ({
    is_logging_in: client.is_logging_in,
    real_account_signup_target: ui.real_account_signup_target,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    has_any_real_account: client.has_any_real_account,
    setRealAccountSignupTarget: ui.setRealAccountSignupTarget,
}))(RealAccountSignupBase);

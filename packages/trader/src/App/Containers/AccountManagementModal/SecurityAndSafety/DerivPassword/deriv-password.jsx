// import PropTypes        from 'prop-types';
import React              from 'react';
import ChangePasswordForm from './change-password-form.jsx';
import ForgotYourPassword from './forgot-your-password.jsx';
import MultiStep          from '../../Components/multistep.jsx';

class DerivPassword extends React.Component {
    constructor(props) {
        super(props);
        this.steps = [
            {
                component: <ChangePasswordForm
                    onClickSendEmail={() => {
                        this.node.nextStep(); // go to the next step
                    }}
                />,
            },
            {
                component: <ForgotYourPassword
                    onClickSendEmail={() => {
                    }}
                />,
            }
        ];
    }

    render() {
        return (
            <MultiStep
                ref={node => this.node = node}
                steps={this.steps}
            />
        );
    }
}

// DerivPassword.propTypes = {};

export default DerivPassword;

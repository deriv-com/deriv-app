// import PropTypes        from 'prop-types';
import React              from 'react';
import { WS }             from 'Services/ws-methods';
import { connect }        from 'Stores/connect';
import ChangePasswordForm from './change-password-form.jsx';
import ForgotYourPassword from './forgot-your-password.jsx';
import MultiStep          from '../../../Components/multistep.jsx';

class DerivPassword extends React.Component {
    constructor(props) {
        super(props);
        this.steps = [
            {
                component: <ChangePasswordForm
                    onClickSendEmail={() => {
                        WS.verifyEmail(this.props.email, 'reset_password');
                        this.node.nextStep(); // go to the next step
                    }}
                />,
            },
            {
                component: <ForgotYourPassword
                    onClickSendEmail={() => {
                        WS.verifyEmail(this.props.email, 'reset_password');
                    }}
                />,
            },
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

export default connect(
    ({ client }) => ({
        email: client.email,
    })
)(DerivPassword);

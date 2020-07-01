import React from 'react';
import { Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

class AccountDeactivated extends React.Component {
    state = {
        is_modal_open: true,
    };
    componentDidMount() {
        this.props.logout();
    }
    render() {
        return (
            <Modal
                is_open={this.state.is_modal_open}
                toggleModal={() => {
                    this.setState({ is_modal_open: !this.state.is_modal_open });
                }}
            >
                <p className='account-deactivated'>
                    {localize('We’re sorry to see you leave. Your account is now deactivated.')}
                </p>
            </Modal>
        );
    }
}

export default connect(({ client }) => ({
    logout: client.logout,
}))(AccountDeactivated);

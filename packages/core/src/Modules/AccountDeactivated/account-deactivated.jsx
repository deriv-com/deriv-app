import React from 'react';
import { Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getDerivComLink } from '@deriv/shared';

class AccountDeactivated extends React.Component {
    state = {
        is_modal_open: true,
        timer: 10,
    };
    componentDidMount() {
        window.history.pushState(null, null, '/');
        // this.props.logout();
        this.handleInterval = setInterval(() => this.counter(), 1000);
        this.timerHandler = setTimeout(() => {
            window.location.href = getDerivComLink();
        }, 10000);
    }
    componentWillUnmount() {
        if (this.timerHandler) clearTimeout(this.timerHandler);
        if (this.handleInterval) clearInterval(this.handleInterval);
    }
    counter() {
        if (this.state.timer > -1) {
            this.setState({ timer: this.state.timer - 1 });
        }
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
                    {localize('We’re sorry to see you leave. Your account is now deactivated.')} {this.state.timer}
                </p>
            </Modal>
        );
    }
}

export default connect(({ client }) => ({
    logout: client.logout,
}))(AccountDeactivated);

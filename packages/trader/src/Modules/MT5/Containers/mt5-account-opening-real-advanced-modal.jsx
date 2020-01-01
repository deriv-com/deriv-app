import { Modal }            from 'deriv-components';
import React, { Component } from 'react';
import Mt5Password          from '../Components/mt5-password.jsx';
import { connect }          from 'Stores/connect';

class MT5AccountOpeningRealAdvancedModal extends Component {
    state = {
        password: '',
    };

    onSave = (index, { password }) => {
        this.setState({ password });
    };

    onSubmit = () => {
        this.props.setAccountType({
            type    : 'advanced',
            category: 'real',
        });
        this.props.openAccount(this.state.password).then(response => {
            console.log(response);
        });
    };

    render() {
        const {
            disableApp,
            enableApp,
            is_real_advanced_password_modal_open,
            closeRealAdvancedPasswordModal,
        } = this.props;
        return (
            <Modal
                className='mt5-advanced-password-modal'
                disableApp={disableApp}
                enableApp={enableApp}
                is_open={is_real_advanced_password_modal_open}
                has_close_icon={false}
                toggleModal={closeRealAdvancedPasswordModal}
                type='button'
                height='519px'
                width='384px'
            >
                <Mt5Password
                    onSave={this.onSave}
                    onCancel={console.log}
                    onSubmit={this.onSubmit}
                />
            </Modal>
        );
    }
}

export default connect(({ ui, modules: { mt5 } }) => ({
    disableApp                          : ui.disableApp,
    enableApp                           : ui.enableApp,
    is_real_advanced_password_modal_open: ui.is_real_advanced_password_modal_open,
    closeRealAdvancedPasswordModal      : ui.closeRealAdvancedPasswordModal,
    openAccount                         : mt5.openAccount,
    setAccountType                      : mt5.setAccountType,
}))(MT5AccountOpeningRealAdvancedModal);

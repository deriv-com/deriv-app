import React, { Component } from 'react';
import { localize }         from 'App/i18n';
import { Modal }            from 'App/Components/Elements/modal.jsx';
import { connect }          from 'Stores/connect';
import AccountWizard        from './account-wizard.jsx';
import AddOrManageAccounts  from './add-or-manage-accounts.jsx';
import FinishedSetCurrency  from './finished-set-currency.jsx';

class RealAccountSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previous_currency : '',
            current_currency  : '',
            active_modal_index: -1,
            modal_content     : [
                {
                    icon : 'IconTheme',
                    label: localize('Add an account'),
                    value: AccountWizard,
                },
                {
                    icon : 'IconTheme',
                    label: localize('Add or manage account'),
                    value: () => <AddOrManageAccounts onSuccessSetAccountCurrency={this.showSetCurrencySuccess} />,
                },
                {
                    label: localize('Successfully updated currency.'),
                    value: () => (
                        <FinishedSetCurrency
                            prev={this.state.previous_currency}
                            current={this.state.current_currency}
                        />
                    ),
                    title: '',
                },
            ],
        };
    }

    showSetCurrencySuccess = (previous_currency, current_currency) => {
        this.setState({
            previous_currency,
            current_currency,
            success_index: 2,
        });
    };

    get active_modal_index() {
        if (this.state.success_index === -1) {
            return this.props.has_real_account ? 1 : 0;
        }

        return this.state.success_index;
    }

    render() {
        const {
            closeRealAccountSignup,
            is_real_acc_signup_on,
        } = this.props;

        const title = this.state.modal_content[this.active_modal_index].label;

        return (
            <Modal
                className='real-account-signup-modal'
                modal_content={this.state.modal_content}
                is_open={is_real_acc_signup_on}
                has_header={this.state.success_index === -1}
                is_sidebar_enabled={false}
                title={title}
                selected_index={this.active_modal_index}
                toggleModal={closeRealAccountSignup}
            />
        );
    }
}

export default connect(({ ui, client }) => ({
    has_real_account      : client.has_real_account,
    is_real_acc_signup_on : ui.is_real_acc_signup_on,
    closeRealAccountSignup: ui.closeRealAccountSignup,
}))(RealAccountSignup);

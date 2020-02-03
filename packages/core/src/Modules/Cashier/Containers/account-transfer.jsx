import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';
import AccountTransferNoAccount from '../Components/Error/account-transfer-no-account.jsx';
import Error from '../Components/Error/error.jsx';
import NoBalance from '../Components/Error/no-balance.jsx';
import Virtual from '../Components/Error/virtual.jsx';
import AccountTransferForm from '../Components/Form/account-transfer-form.jsx';
import AccountTransferReceipt from '../Components/Receipt/account-transfer-receipt.jsx';
import Loading from '../../../templates/_common/components/loading.jsx';

class AccountTransfer extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
        this.props.onMount();
    }

    render() {
        if (this.props.is_virtual) {
            return <Virtual />;
        }
        if (this.props.is_loading) {
            return <Loading className='cashier__loader' />;
        }
        if (this.props.error.is_show_full_page || (this.props.error.message && !this.props.accounts_list.length)) {
            // for errors with CTA hide the form and show the error,
            // for others show them at the bottom of the form next to submit button
            return <Error error={this.props.error} />;
        }
        if (this.props.has_no_account) {
            return <AccountTransferNoAccount />;
        }
        if (this.props.has_no_accounts_balance) {
            return <NoBalance />;
        }
        if (this.props.is_transfer_successful) {
            return <AccountTransferReceipt />;
        }
        return <AccountTransferForm error={this.props.error} />;
    }
}

AccountTransfer.propTypes = {
    accounts_list: PropTypes.array,
    container: PropTypes.string,
    error: PropTypes.object,
    has_no_account: PropTypes.bool,
    has_no_accounts_balance: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_transfer_successful: PropTypes.bool,
    is_virtual: PropTypes.bool,
    onMount: PropTypes.func,
    setActiveTab: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    is_virtual: client.is_virtual,
    accounts_list: modules.cashier.config.account_transfer.accounts_list,
    container: modules.cashier.config.account_transfer.container,
    error: modules.cashier.config.account_transfer.error,
    has_no_account: modules.cashier.config.account_transfer.has_no_account,
    has_no_accounts_balance: modules.cashier.config.account_transfer.has_no_accounts_balance,
    is_loading: modules.cashier.is_loading,
    is_transfer_successful: modules.cashier.config.account_transfer.is_transfer_successful,
    onMount: modules.cashier.onMountAccountTransfer,
    setActiveTab: modules.cashier.setActiveTab,
}))(AccountTransfer);

import PropTypes           from 'prop-types';
import React               from 'react';
import { connect }         from 'Stores/connect';
import AccountTransferForm from './AccountTransfer/account-transfer-form.jsx';

class AccountTransfer extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
    }

    render() {
        return (
            <React.Fragment>
                <AccountTransferForm />
            </React.Fragment>
        );
    }
}

AccountTransfer.propTypes = {
    container   : PropTypes.string,
    setActiveTab: PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        container   : modules.cashier.config.account_transfer.container,
        setActiveTab: modules.cashier.setActiveTab,
    })
)(AccountTransfer);

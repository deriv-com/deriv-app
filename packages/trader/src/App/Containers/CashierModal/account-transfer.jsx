import PropTypes              from 'prop-types';
import React                  from 'react';
import { connect }            from 'Stores/connect';
import AccountTransferForm    from './AccountTransfer/account-transfer-form.jsx';
import AccountTransferReceipt from './AccountTransfer/account-transfer-receipt.jsx';
import Error                  from './error.jsx';
import Loading                from '../../../templates/_common/components/loading.jsx';

class AccountTransfer extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
        this.props.onMount();
    }

    render() {
        return (
            <React.Fragment>
                {this.props.is_loading ?
                    <Loading className='cashier__loader' />
                    :
                    <React.Fragment>
                        {/* for errors with CTA hide the form and show the error,
                         for others show them at the bottom of the form next to submit button */}
                        {this.props.error.button_text ?
                            <Error error={this.props.error} />
                            :
                            (this.props.is_transfer_successful ?
                                <AccountTransferReceipt />
                                :
                                <AccountTransferForm error={this.props.error} />)
                        }
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

AccountTransfer.propTypes = {
    container             : PropTypes.string,
    error                 : PropTypes.object,
    is_loading            : PropTypes.bool,
    is_transfer_successful: PropTypes.bool,
    onMount               : PropTypes.func,
    setActiveTab          : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        container             : modules.cashier.config.account_transfer.container,
        error                 : modules.cashier.config.account_transfer.error,
        onMount               : modules.cashier.onMountAccountTransfer,
        is_loading            : modules.cashier.is_loading,
        is_transfer_successful: modules.cashier.config.account_transfer.is_transfer_successful,
        setActiveTab          : modules.cashier.setActiveTab,
    })
)(AccountTransfer);

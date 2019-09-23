import PropTypes                from 'prop-types';
import React                    from 'react';
import { connect }              from 'Stores/connect';
import AccountTransferForm      from './AccountTransfer/account-transfer-form.jsx';
import AccountTransferNoAccount from './AccountTransfer/account-transfer-no-account.jsx';
import AccountTransferNoBalance from './AccountTransfer/account-transfer-no-balance.jsx';
import AccountTransferReceipt   from './AccountTransfer/account-transfer-receipt.jsx';
import Error                    from './error.jsx';
import Loading                  from '../../../templates/_common/components/loading.jsx';

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
                            (this.props.has_no_account ?
                                <AccountTransferNoAccount />
                                :
                                (this.props.has_no_balance ?
                                    <AccountTransferNoBalance setModalIndex={this.props.setModalIndex} />
                                    :
                                    (this.props.is_transfer_successful ?
                                        <AccountTransferReceipt />
                                        :
                                        <AccountTransferForm error={this.props.error} />
                                    )
                                )
                            )
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
    has_no_account        : PropTypes.bool,
    has_no_balance        : PropTypes.bool,
    is_loading            : PropTypes.bool,
    is_transfer_successful: PropTypes.bool,
    onMount               : PropTypes.func,
    setActiveTab          : PropTypes.func,
    setModalIndex         : PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        container             : modules.cashier.config.account_transfer.container,
        error                 : modules.cashier.config.account_transfer.error,
        has_no_account        : modules.cashier.config.account_transfer.has_no_account,
        has_no_balance        : modules.cashier.config.account_transfer.has_no_balance,
        is_loading            : modules.cashier.is_loading,
        is_transfer_successful: modules.cashier.config.account_transfer.is_transfer_successful,
        onMount               : modules.cashier.onMountAccountTransfer,
        setActiveTab          : modules.cashier.setActiveTab,
        setModalIndex         : ui.setModalIndex,
    })
)(AccountTransfer);

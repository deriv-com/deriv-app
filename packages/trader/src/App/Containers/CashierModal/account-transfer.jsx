import PropTypes                from 'prop-types';
import React                    from 'react';
import { connect }              from 'Stores/connect';
import AccountTransferForm      from './AccountTransfer/account-transfer-form.jsx';
import AccountTransferNoAccount from './AccountTransfer/account-transfer-no-account.jsx';
import AccountTransferReceipt   from './AccountTransfer/account-transfer-receipt.jsx';
import Error                    from './error.jsx';
import NoBalance                from './no-balance.jsx';
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
                        {this.props.error.is_show_full_page ||
                        (this.props.error.message && !this.props.accounts_list.length) ?
                            <Error error={this.props.error} />
                            :
                            (this.props.has_no_account ?
                                <AccountTransferNoAccount />
                                :
                                (this.props.has_no_accounts_balance ?
                                    <NoBalance />
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
    accounts_list          : PropTypes.array,
    container              : PropTypes.string,
    error                  : PropTypes.object,
    has_no_account         : PropTypes.bool,
    has_no_accounts_balance: PropTypes.bool,
    is_loading             : PropTypes.bool,
    is_transfer_successful : PropTypes.bool,
    onMount                : PropTypes.func,
    setActiveTab           : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        accounts_list          : modules.cashier.config.account_transfer.accounts_list,
        container              : modules.cashier.config.account_transfer.container,
        error                  : modules.cashier.config.account_transfer.error,
        has_no_account         : modules.cashier.config.account_transfer.has_no_account,
        has_no_accounts_balance: modules.cashier.config.account_transfer.has_no_accounts_balance,
        is_loading             : modules.cashier.is_loading,
        is_transfer_successful : modules.cashier.config.account_transfer.is_transfer_successful,
        onMount                : modules.cashier.onMountAccountTransfer,
        setActiveTab           : modules.cashier.setActiveTab,
    })
)(AccountTransfer);

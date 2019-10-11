import PropTypes             from 'prop-types';
import React, { Component }  from 'react';
import { ThemedScrollbars }  from 'deriv-components';
import { connect }           from 'Stores/connect';
import AddCryptoCurrency     from './add-crypto-currency.jsx';
import ChangeAccountCurrency from './change-account-currency.jsx';
import 'Sass/add-or-manage.scss';
import 'Sass/change-account.scss';

class AddOrManageAccounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finished  : undefined,
            form_error: '',
            form_value: {
                crypto: '',
                fiat  : '',
            },
        };
    }

    clearError = () => {
        this.setState({
            form_error: '',
        });
    };

    manageOrChangeAccount = (obj, setSubmitting) => {
        this.props.onLoading();
        Object.entries(obj)
            .map(([key, value]) => {
                if (key === 'fiat') {
                    this.props.setCurrency(value)
                        .then(response => {
                            setSubmitting(false);
                            this.props.onSuccessSetAccountCurrency(
                                response.passthrough.previous_currency,
                                response.echo_req.set_account_currency,
                            );
                        })
                        .catch(error_message => {
                            this.props.onError(error_message);
                        });
                } else {
                    // Add Crypto Account
                    this.props.createCryptoAccount(value)
                        .then(() => {
                            this.props.onSuccessAddCurrency(
                                value,
                            );
                            setSubmitting(false);
                        })
                        .catch(error_message => {
                            this.props.onError(error_message);
                        });
                }
            });
    };

    updateValue = (index, value, setSubmitting) => {
        this.manageOrChangeAccount(value, setSubmitting);
    };

    render() {
        return (
            <ThemedScrollbars autoHide>
                <div className='account-wizard add-or-manage'>
                    {this.props.available_crypto_currencies.length !== 0 &&
                        <AddCryptoCurrency
                            className='account-wizard__body'
                            onSubmit={this.updateValue}
                            value={this.state.form_value}
                            form_error={this.state.form_error}
                            {...this.props}
                        />
                    }
                    {this.props.can_change_fiat_currency &&
                    <div className='change-currency'>
                        <ChangeAccountCurrency
                            className='account-wizard__body'
                            onSubmit={this.updateValue}
                            value={this.state.form_value}
                            form_error={this.state.form_error}
                            {...this.props}
                        />
                    </div>
                    }
                </div>
            </ThemedScrollbars>
        );
    }
}

AddOrManageAccounts.propTypes = {
    onError                    : PropTypes.func,
    onLoading                  : PropTypes.func,
    onSuccessAddCurrency       : PropTypes.func,
    onSuccessSetAccountCurrency: PropTypes.func,
};

export default connect(({ client }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    can_change_fiat_currency   : client.can_change_fiat_currency,
    setCurrency                : client.setAccountCurrency,
    createCryptoAccount        : client.createCryptoAccount,
}))(AddOrManageAccounts);

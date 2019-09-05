import PropTypes             from 'prop-types';
import React, { Component }  from 'react';
import { connect }           from 'Stores/connect';
import AddCryptoCurrency     from './add-crypto-currency.jsx';
import ChangeAccountCurrency from './change-account-currency.jsx';
import 'Sass/add-or-manage.scss';
import 'Sass/change-account.scss';

const CLEAR_ERROR_TIMEOUT = 5000;

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

    goSuccessCryptoChange = (response) => {
        // remove account wizard
    };

    getFinishedComponent = () => {
        return this.state.finished;
    };

    manageOrChangeAccount = (obj, setSubmitting) => {
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
                        .catch(e => {
                            this.setState({
                                form_error: e,
                            }, () => {
                                setTimeout(() => {
                                    this.clearError();
                                    setSubmitting(false);
                                }, CLEAR_ERROR_TIMEOUT);
                            });
                        });
                } else {
                    // Add Crypto Account
                    this.props.createCryptoAccount(value)
                        .then(response => {
                            setSubmitting(false);
                            this.goSuccessCrypto(response);
                        })
                        .catch(e => {
                            this.setState({
                                form_error: e,
                            }, () => {
                                setTimeout(() => {
                                    this.clearError();
                                    setSubmitting(false);
                                }, CLEAR_ERROR_TIMEOUT);
                            });
                        });
                }
            });
    };

    updateValue = (index, value, setSubmitting) => {
        this.manageOrChangeAccount(value, setSubmitting);
    };

    render() {
        return (
            <div className='account-wizard add-or-manage'>
                <AddCryptoCurrency
                    className='account-wizard__body'
                    onSubmit={this.updateValue}
                    value={this.state.form_value}
                    form_error={this.state.form_error}
                    {...this.props}
                />
                <div className='change-currency'>
                    <ChangeAccountCurrency
                        className='account-wizard__body'
                        onSubmit={this.updateValue}
                        value={this.state.form_value}
                        form_error={this.state.form_error}
                        {...this.props}
                    />
                </div>
            </div>
        );
    }
}

AddOrManageAccounts.propTypes = {
    onSuccessSetAccountCurrency: PropTypes.func,
};

export default connect(({ client }) => ({
    has_real_account   : client.has_real_account,
    realAccountSignup  : client.realAccountSignup,
    setCurrency        : client.setAccountCurrency,
    createCryptoAccount: client.createCryptoAccount,
}))(AddOrManageAccounts);

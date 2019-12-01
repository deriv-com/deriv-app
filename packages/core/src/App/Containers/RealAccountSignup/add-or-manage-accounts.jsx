import classNames             from 'classnames';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { ThemedScrollbars }   from 'deriv-components';
import { localize, Localize } from 'deriv-translations';
import { connect }            from 'Stores/connect';
import AddCryptoCurrency      from './add-crypto-currency.jsx';
import ChangeAccountCurrency  from './change-account-currency.jsx';
import 'Sass/add-or-manage.scss';
import 'Sass/change-account.scss';

class AddOrManageAccounts extends React.Component {
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
            <ThemedScrollbars
                autoHide
                style={{ height: '100%' }}
            >
                <div className='account-wizard add-or-manage'>
                    <div className={classNames('add-crypto-currency', {
                        'account-wizard--disabled': this.props.available_crypto_currencies.length === 0,
                    })}
                    >
                        {this.props.available_crypto_currencies.length === 0 &&
                            <div className='account-wizard--disabled-message'>
                                <p>{localize('You already have an account for each of the cryptocurrencies available on Deriv.')}</p>
                            </div>
                        }
                        <AddCryptoCurrency
                            className='account-wizard__body'
                            onSubmit={this.updateValue}
                            value={this.state.form_value}
                            form_error={this.state.form_error}
                            {...this.props}
                        />
                    </div>
                    {this.props.has_fiat &&
                        <div className={classNames('change-currency', {
                            'account-wizard--disabled': !this.props.can_change_fiat_currency,
                        })}
                        >
                            {!this.props.can_change_fiat_currency &&
                                <div className='account-wizard--disabled-message'>
                                    <p>
                                        {this.props.current_currency_type === 'fiat' ?
                                            <Localize
                                                i18n_default_text='Currency change is not available because either you have deposited money into your {{currency}} account or you have created a real MetaTrader 5 (MT5) account.'
                                                values={{
                                                    currency: this.props.currency.toUpperCase(),
                                                }}
                                            />
                                            :
                                            <Localize
                                                i18n_default_text='Please switch to your {{fiat_currency}} account to change currencies.'
                                                values={{
                                                    fiat_currency: this.props.current_fiat_currency.toUpperCase(),
                                                }}
                                            />
                                        }
                                    </p>
                                </div>
                            }
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
    currency                   : client.currency,
    current_currency_type      : client.current_currency_type,
    current_fiat_currency      : client.current_fiat_currency,
    has_fiat                   : client.has_fiat,
    setCurrency                : client.setAccountCurrency,
    createCryptoAccount        : client.createCryptoAccount,
}))(AddOrManageAccounts);

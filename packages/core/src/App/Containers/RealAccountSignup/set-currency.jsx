import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { website_name } from 'App/Constants/app-config';
import { connect } from 'Stores/connect';
import CurrencySelector from './currency-selector.jsx';
import 'Sass/set-currency.scss';
import 'Sass/change-account.scss';

class SetCurrency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form_error: '',
            form_value: {
                crypto: '',
                fiat: '',
            },
        };
    }

    clearError = () => this.setState({ form_error: '' });

    setCurrency = (obj, setSubmitting) => {
        console.log(obj, setSubmitting, this.props);
        this.props.onLoading();
        Object.entries(obj).map(([key, value]) => {
            console.log(key, value);
            if (key === 'fiat') {
                this.props
                    .setCurrency(value)
                    .then(response => {
                        console.log(response);
                        setSubmitting(false);
                        this.props.onSuccessSetAccountCurrency(
                            response.passthrough.previous_currency,
                            response.echo_req.set_account_currency
                        );
                    })
                    .catch(error_message => {
                        console.log(error_message);
                        this.props.onError(error_message);
                    });
            } else {
                // Add Crypto Account
                this.props
                    .createCryptoAccount(value)
                    .then(() => {
                        this.props.onSuccessAddCurrency(value);
                        setSubmitting(false);
                    })
                    .catch(error_message => {
                        this.props.onError(error_message);
                    });
            }
        });
    };

    updateValue = (value, setSubmitting) => {
        console.log(value);
        this.setCurrency(value, setSubmitting);
    };

    get no_crypto_available() {
        return this.props.available_crypto_currencies.length === 0 && this.props.has_fiat;
    }

    get should_hide_crypto() {
        return this.props.is_eu_enabled && this.props.is_eu; // TODO [deriv-eu] remove is_eu_enabled once released
    }

    render() {
        return (
            <div
                className={classNames('set-currency-modal', {
                    'set-currency-modal--disabled':
                        this.props.available_crypto_currencies.length === 0 && this.props.has_fiat,
                })}
            >
                {this.props.available_crypto_currencies.length === 0 && this.props.has_fiat && (
                    <div className='set-currency-modal--disabled-message'>
                        <p>
                            {localize(
                                'You already have an account for each of the cryptocurrencies available on {{deriv}}.',
                                {
                                    deriv: website_name,
                                }
                            )}
                        </p>
                    </div>
                )}
                <div className='set-currency-modal__heading-container'>
                    <p className='set-currency-modal__heading-container__main-heading'>
                        {localize(
                            'You have an account that do not have currency assigned. Please choose a currency to trade with this account.'
                        )}
                    </p>
                    <p className='set-currency-modal__heading-container__sub-heading'>
                        {localize('Please choose your currency')}
                    </p>
                </div>
                <CurrencySelector
                    className='account-wizard__body'
                    onSubmit={this.updateValue}
                    value={this.state.form_value}
                    form_error={this.state.form_error}
                    set_currency
                    {...this.props}
                />
            </div>
        );
    }
}

SetCurrency.propTypes = {};

export default connect(({ client, ui }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    can_change_fiat_currency: client.can_change_fiat_currency,
    currency: client.currency,
    current_currency_type: client.current_currency_type,
    current_fiat_currency: client.current_fiat_currency,
    is_eu_enabled: ui.is_eu_enabled, // TODO [deriv-eu] remove is_eu_enabled once eu is released.
    is_eu: client.is_eu,
    has_fiat: client.has_fiat,
    setCurrency: client.setAccountCurrency,
    createCryptoAccount: client.createCryptoAccount,
}))(SetCurrency);

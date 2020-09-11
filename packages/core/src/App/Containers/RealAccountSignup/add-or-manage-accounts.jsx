import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Div100vhContainer, ThemedScrollbars } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getCurrencyDisplayCode, isDesktop, isMobile, website_name } from '@deriv/shared';
import { connect } from 'Stores/connect';
import AddCryptoCurrency from './add-crypto-currency.jsx';
import ChangeAccountCurrency from './change-account-currency.jsx';
import LoadingModal from './real-account-signup-loader.jsx';
import 'Sass/add-or-manage.scss';
import 'Sass/change-account.scss';

class AddOrManageAccounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: undefined,
            form_error: '',
            form_value: {
                crypto: '',
                fiat: '',
            },
        };
    }

    clearError = () => {
        this.setState({
            form_error: '',
        });
    };

    manageOrChangeAccount = (obj, setSubmitting) => {
        this.props.setLoading(true);
        Object.entries(obj).map(([key, value]) => {
            if (key === 'fiat') {
                this.props
                    .setCurrency(value)
                    .then(response => {
                        setSubmitting(false);
                        this.props.onSuccessSetAccountCurrency(
                            response.passthrough.previous_currency,
                            response.echo_req.set_account_currency
                        );
                    })
                    .catch(error_message => {
                        this.props.onError(error_message);
                    })
                    .finally(() => this.props.setLoading(false));
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
                    })
                    .finally(() => this.props.setLoading(false));
            }
        });
    };

    updateValue = (index, value, setSubmitting) => {
        this.manageOrChangeAccount(value, setSubmitting);
    };

    get no_crypto_available() {
        return this.props.available_crypto_currencies.length === 0 && this.props.has_fiat;
    }

    get should_hide_crypto() {
        return this.props.is_eu_enabled && this.props.is_eu; // TODO [deriv-eu] remove is_eu_enabled once released
    }

    render() {
        if (this.props.is_loading) return <LoadingModal />;

        return (
            <ThemedScrollbars is_bypassed={isMobile()} autohide={false}>
                <Div100vhContainer
                    className='account-wizard add-or-manage'
                    is_disabled={isDesktop()}
                    height_offset='40px'
                >
                    {!this.should_hide_crypto && (
                        <div
                            className={classNames('add-crypto-currency', {
                                'account-wizard--disabled': this.no_crypto_available,
                            })}
                        >
                            {this.no_crypto_available && (
                                <div className='account-wizard--disabled-message'>
                                    <p className='add-crypto-currency'>
                                        {localize(
                                            'You already have an account for each of the cryptocurrencies available on {{website_name}}.',
                                            { website_name }
                                        )}
                                    </p>
                                </div>
                            )}
                            <AddCryptoCurrency
                                className='account-wizard__body'
                                onSubmit={this.updateValue}
                                value={this.state.form_value}
                                form_error={this.state.form_error}
                                {...this.props}
                            />
                        </div>
                    )}
                    {this.props.has_fiat && (
                        <div
                            className={classNames('change-currency', {
                                'account-wizard--disabled': !this.props.can_change_fiat_currency,
                            })}
                        >
                            {!this.props.can_change_fiat_currency && (
                                <div className='account-wizard--disabled-message'>
                                    <p>
                                        {this.props.current_currency_type === 'fiat' ? (
                                            <Localize
                                                i18n_default_text='Currency change is not available because either you have deposited money into your {{currency}} account or you have created a real MetaTrader 5 (MT5) account.'
                                                values={{
                                                    currency: getCurrencyDisplayCode(this.props.currency),
                                                }}
                                            />
                                        ) : (
                                            <Localize
                                                i18n_default_text='Please switch to your {{fiat_currency}} account to change currencies.'
                                                values={{
                                                    fiat_currency: this.props.current_fiat_currency.toUpperCase(),
                                                }}
                                            />
                                        )}
                                    </p>
                                </div>
                            )}
                            <ChangeAccountCurrency
                                className='account-wizard__body'
                                onSubmit={this.updateValue}
                                value={this.state.form_value}
                                form_error={this.state.form_error}
                                {...this.props}
                            />
                        </div>
                    )}
                </Div100vhContainer>
            </ThemedScrollbars>
        );
    }
}

AddOrManageAccounts.propTypes = {
    onError: PropTypes.func,
    onLoading: PropTypes.func,
    onSuccessAddCurrency: PropTypes.func,
    onSuccessSetAccountCurrency: PropTypes.func,
};

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
}))(AddOrManageAccounts);

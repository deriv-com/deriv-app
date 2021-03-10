import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Tabs, ThemedScrollbars } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getCurrencyDisplayCode, isDesktop, isMobile, website_name } from '@deriv/shared';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import AddCryptoCurrency from './add-crypto-currency.jsx';
import ChangeAccountCurrency from './change-account-currency.jsx';
import LoadingModal from './real-account-signup-loader.jsx';
import 'Sass/add-or-manage.scss';
import 'Sass/change-account.scss';

const AddOrManageAccounts = props => {
    const {
        available_crypto_currencies,
        can_change_fiat_currency,
        createCryptoAccount,
        currency,
        current_currency_type,
        has_fiat,
        is_eu,
        is_loading,
        onError,
        onSuccessSetAccountCurrency,
        setCurrency,
        setLoading,
    } = props;

    const [active_index, setActiveIndex] = React.useState(
        has_fiat && available_crypto_currencies?.length === 0 ? 1 : 0
    );
    const [form_error] = React.useState('');
    const [form_value] = React.useState({ crypto: '', fiat: '' });

    React.useEffect(() => {
        const fetchMt5LoginList = async () => {
            setLoading(true);
            await WS.mt5LoginList();
            setLoading(false);
        };
        fetchMt5LoginList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setActiveTabIndex = index => {
        setActiveIndex(index);
    };

    const manageOrChangeAccount = (obj, setSubmitting) => {
        setLoading(true);
        Object.entries(obj).map(([key, value]) => {
            if (key === 'fiat') {
                setCurrency(value)
                    .then(response => {
                        setSubmitting(false);
                        onSuccessSetAccountCurrency(
                            response.passthrough.previous_currency,
                            response.echo_req.set_account_currency
                        );
                    })
                    .catch(error => {
                        onError(error);
                    })
                    .finally(() => setLoading(false));
            } else {
                // Add Crypto Account
                createCryptoAccount(value)
                    .then(() => {
                        onSuccessSetAccountCurrency('', value);
                        setSubmitting(false);
                    })
                    .catch(error => {
                        onError(error);
                    })
                    .finally(() => setLoading(false));
            }
        });
    };

    const updateValue = (index, value, setSubmitting) => {
        manageOrChangeAccount(value, setSubmitting);
    };

    const hasNoAvailableCrypto = () => {
        return available_crypto_currencies.length === 0 && has_fiat;
    };

    if (is_loading) return <LoadingModal />;

    const fiat_section = has_fiat && (
        <div
            className={classNames('change-currency', {
                'account-wizard--disabled': !can_change_fiat_currency,
            })}
        >
            {!can_change_fiat_currency && (
                <div className='account-wizard--disabled-message'>
                    <p>
                        {current_currency_type === 'fiat' ? (
                            <Localize
                                i18n_default_text='Currency change is not available because either you have deposited money into your {{currency}} account or you have created a real MetaTrader 5 (MT5) account.'
                                values={{
                                    currency: getCurrencyDisplayCode(currency),
                                }}
                            />
                        ) : (
                            <Localize
                                i18n_default_text='Please switch to your {{fiat_currency}} account to change currencies.'
                                values={{
                                    // eslint-disable-next-line
                                    fiat_currency: props.current_fiat_currency.toUpperCase(),
                                }}
                            />
                        )}
                    </p>
                </div>
            )}
            <ChangeAccountCurrency
                className='account-wizard__body'
                onSubmit={updateValue}
                value={form_value}
                form_error={form_error}
                {...props}
            />
        </div>
    );

    return (
        <ThemedScrollbars is_bypassed={isMobile()} autohide={false}>
            {is_eu && has_fiat ? (
                fiat_section
            ) : (
                <Tabs
                    active_index={active_index}
                    className='account-wizard add-or-manage tabs--desktop'
                    onTabItemClick={setActiveTabIndex}
                    top
                    header_fit_content={isDesktop()}
                >
                    <div label={localize('Cryptocurrencies')}>
                        <div
                            className={classNames('add-crypto-currency', {
                                'account-wizard--disabled': hasNoAvailableCrypto(),
                            })}
                        >
                            {hasNoAvailableCrypto() && (
                                <div className='account-wizard--disabled-message'>
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
                            <AddCryptoCurrency
                                className='account-wizard__body'
                                onSubmit={updateValue}
                                value={form_value}
                                form_error={form_error}
                                should_show_crypto_only
                                {...props}
                            />
                        </div>
                    </div>
                    <div label={localize('Fiat currencies')}>
                        {has_fiat ? (
                            fiat_section
                        ) : (
                            <AddCryptoCurrency
                                className='account-wizard__body'
                                onSubmit={updateValue}
                                value={form_value}
                                form_error={form_error}
                                should_show_fiat_only={true}
                                {...props}
                            />
                        )}
                    </div>
                </Tabs>
            )}
        </ThemedScrollbars>
    );
};

AddOrManageAccounts.propTypes = {
    onError: PropTypes.func,
    onLoading: PropTypes.func,
    onSuccessSetAccountCurrency: PropTypes.func,
};

export default connect(({ client }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    can_change_fiat_currency: client.can_change_fiat_currency,
    currency: client.currency,
    current_currency_type: client.current_currency_type,
    current_fiat_currency: client.current_fiat_currency,
    has_fiat: client.has_fiat,
    is_eu: client.is_eu,
    setCurrency: client.setAccountCurrency,
    createCryptoAccount: client.createCryptoAccount,
}))(AddOrManageAccounts);

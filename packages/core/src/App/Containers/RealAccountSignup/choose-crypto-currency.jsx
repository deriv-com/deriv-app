import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormSubmitButton, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile, reorderCurrencies } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { CurrencyRadioButtonGroup, CurrencyRadioButton } from '@deriv/account';
import './currency-selector.scss';

const CRYPTO_CURRENCY_TYPE = 'crypto';

const ChooseCryptoCurrency = ({
    account_list,
    available_crypto_currencies,
    closeRealAccountSignup,
    continueRouteAfterChooseCrypto,
    currency_title,
    legal_allowed_currencies,
    openRealAccountSignup,
    switchAccount,
    should_show_all_available_currencies,
    setShouldShowAllAvailableCurrencies,
}) => {
    React.useEffect(() => {
        return () => setShouldShowAllAvailableCurrencies(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const has_all_cryptos = () => {
        return (
            legal_allowed_currencies.filter(
                currency =>
                    currency.type === CRYPTO_CURRENCY_TYPE && !account_list.some(x => x.title === currency.value)
            ).length === 0
        );
    };

    const getReorderedCryptoCurrencies = () => {
        const reorderCryptoCurrencies = should_show_all_available_currencies
            ? reorderCurrencies(
                  legal_allowed_currencies.filter(currency => account_list.some(x => x.title === currency.value)),
                  CRYPTO_CURRENCY_TYPE
              )
            : reorderCurrencies(
                  legal_allowed_currencies.filter(
                      currency =>
                          currency.type === CRYPTO_CURRENCY_TYPE &&
                          !available_crypto_currencies.some(x => x.value === currency.value)
                  ),
                  CRYPTO_CURRENCY_TYPE
              );
        if (!has_all_cryptos()) {
            reorderCryptoCurrencies.push({
                value: 'plus',
                name: 'Add new',
                secondLineLabel: 'crypto account',
                icon: 'IcCashierAdd',
            });
        }

        return reorderCryptoCurrencies;
    };

    const [form_error] = React.useState('');
    const [form_value] = React.useState({ crypto: '' });

    const doSwitch = async value => {
        const target_account = account_list.filter(account => account.title === value);
        const loginid = target_account.map(x => x.loginid)[0];
        await switchAccount(loginid);
    };

    const onSubmit = async obj => {
        Object.entries(obj).map(([title, value]) => {
            if (title === 'currency') {
                if (value === 'plus') {
                    openRealAccountSignup('add');
                } else {
                    closeRealAccountSignup();
                    if (value !== currency_title) {
                        doSwitch(value);
                    }
                    continueRouteAfterChooseCrypto();
                }
            }
        });
    };

    return (
        <Formik
            initialValues={{
                currency: form_value.currency,
            }}
            onSubmit={values => {
                onSubmit(values);
            }}
        >
            {({ handleSubmit, values, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <Text as='h1' color='prominent' align='center' weight='bold' className='add-crypto-currency__title'>
                        {localize('Choose one of your accounts or add a new cryptocurrency account')}
                    </Text>
                    <CurrencyRadioButtonGroup
                        id='crypto_currency'
                        className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                        item_count={getReorderedCryptoCurrencies().length}
                    >
                        {getReorderedCryptoCurrencies().map(currency => (
                            <Field
                                key={currency.value}
                                component={CurrencyRadioButton}
                                name='currency'
                                id={currency.value}
                                label={currency.name}
                                icon={currency.icon}
                                secondLineLabel={currency.secondLineLabel}
                            />
                        ))}
                    </CurrencyRadioButtonGroup>
                    <FormSubmitButton
                        className='currency-selector__button'
                        is_disabled={isSubmitting || !values.currency}
                        label={localize('Continue')}
                        is_absolute={!isMobile()}
                        form_error={form_error}
                    />
                </form>
            )}
        </Formik>
    );
};

ChooseCryptoCurrency.propTypes = {
    account_list: PropTypes.array,
    available_crypto_currencies: PropTypes.array,
    closeRealAccountSignup: PropTypes.func,
    continueRouteAfterChooseCrypto: PropTypes.func,
    currency_title: PropTypes.string,
    legal_allowed_currencies: PropTypes.array,
    openRealAccountSignup: PropTypes.func,
    switchAccount: PropTypes.func,
};

export default connect(({ client, modules, ui }) => ({
    account_list: client.account_list,
    available_crypto_currencies: client.available_crypto_currencies,
    closeRealAccountSignup: ui.closeRealAccountSignup,
    continueRouteAfterChooseCrypto: ui.continueRouteAfterChooseCrypto,
    currency_title: client.currency,
    legal_allowed_currencies: client.upgradeable_currencies,
    openRealAccountSignup: ui.openRealAccountSignup,
    switchAccount: client.switchAccount,
    should_show_all_available_currencies: modules.cashier.should_show_all_available_currencies,
    setShouldShowAllAvailableCurrencies: modules.cashier.setShouldShowAllAvailableCurrencies,
}))(ChooseCryptoCurrency);

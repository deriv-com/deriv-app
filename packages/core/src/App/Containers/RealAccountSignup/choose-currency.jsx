import { Field, Formik } from 'formik';
import React from 'react';
import { FormSubmitButton, Loading, Text, ThemedScrollbars } from '@deriv/components';
import { usePaymentAgentList } from '@deriv/hooks';
import { localize } from '@deriv/translations';
import { reorderCurrencies, routes } from '@deriv/shared';
import { CurrencyRadioButtonGroup, CurrencyRadioButton } from '@deriv/account';
import CurrencyProvider from './choose-currency';
import { observer, useStore } from '@deriv/stores';
import './currency-selector.scss';

const CRYPTO_CURRENCY_TYPE = 'crypto';

const ChooseCurrency = observer(() => {
    const { client, modules, ui } = useStore();
    const {
        account_list,
        available_crypto_currencies,
        currency: currency_title,
        has_fiat,
        upgradeable_currencies: legal_allowed_currencies,
        switchAccount,
    } = client;
    const { cashier } = modules;
    const { closeRealAccountSignup, continueRouteAfterChooseCrypto, openRealAccountSignup, setShouldShowCancel } = ui;
    const deposit_target = cashier.general_store.deposit_target;
    const should_show_all_available_currencies = cashier.general_store.should_show_all_available_currencies;
    const setShouldShowAllAvailableCurrencies = cashier.general_store.setShouldShowAllAvailableCurrencies;
    const [form_error] = React.useState('');
    const [form_value] = React.useState({ crypto: '' });

    const { data: all_payment_agent_list, isLoading: is_loading } = usePaymentAgentList();

    React.useEffect(() => {
        return () => setShouldShowAllAvailableCurrencies(false);
    }, [setShouldShowAllAvailableCurrencies]);

    const getReorderedCryptoCurrencies = React.useMemo(() => {
        const hasAllCryptos = () => {
            return (
                legal_allowed_currencies?.filter(
                    currency =>
                        currency.type === CRYPTO_CURRENCY_TYPE && !account_list.some(x => x.title === currency.value)
                ).length === 0
            );
        };

        const addNewCryptoAccount = () => {
            openRealAccountSignup(deposit_target === routes.cashier_pa ? 'add_currency' : 'add_crypto');
            setShouldShowCancel(true);
        };

        const allowed_currencies_payment_agent_availability = CurrencyProvider.currenciesPaymentAgentAvailability(
            legal_allowed_currencies,
            all_payment_agent_list,
            account_list
        );

        const reorderCryptoCurrencies = should_show_all_available_currencies
            ? reorderCurrencies(
                  allowed_currencies_payment_agent_availability?.filter(currency =>
                      account_list.some(x => x.title === currency.value)
                  ),
                  CRYPTO_CURRENCY_TYPE
              )
            : reorderCurrencies(
                  allowed_currencies_payment_agent_availability?.filter(
                      currency =>
                          currency.type === CRYPTO_CURRENCY_TYPE &&
                          !available_crypto_currencies.some(x => x.value === currency.value)
                  ),
                  CRYPTO_CURRENCY_TYPE
              );

        const show_add_button = deposit_target === routes.cashier_pa ? !has_fiat || !hasAllCryptos() : !hasAllCryptos();

        if (show_add_button) {
            reorderCryptoCurrencies.push({
                value: 'plus',
                name: deposit_target === routes.cashier_pa ? localize('Add a new') : localize('Add new'),
                second_line_label:
                    deposit_target === routes.cashier_pa ? localize('account') : localize('crypto account'),
                icon: 'IcAddAccount',
                onClick: () => addNewCryptoAccount(),
                has_payment_agent: true,
            });
        }

        return reorderCryptoCurrencies;
    }, [
        account_list,
        all_payment_agent_list,
        available_crypto_currencies,
        deposit_target,
        has_fiat,
        legal_allowed_currencies,
        should_show_all_available_currencies,
        openRealAccountSignup,
        setShouldShowCancel,
    ]);

    const doSwitch = async value => {
        const target_account = account_list.filter(account => account.title === value);
        const loginid = target_account.map(x => x.loginid)[0];
        if (loginid) await switchAccount(loginid);
    };

    const onSubmit = async obj => {
        Object.entries(obj).map(([title, value]) => {
            if (title) {
                closeRealAccountSignup();
                if (value !== currency_title) {
                    doSwitch(value);
                }
                continueRouteAfterChooseCrypto();
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
                        {deposit_target === routes.cashier_pa
                            ? localize('Choose an account or add a new one')
                            : localize('Choose one of your accounts or add a new cryptocurrency account')}
                    </Text>
                    <ThemedScrollbars>
                        {is_loading ? (
                            <Loading is_fullscreen={false} />
                        ) : (
                            <CurrencyRadioButtonGroup
                                id='crypto_currency'
                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                item_count={getReorderedCryptoCurrencies.length}
                            >
                                {getReorderedCryptoCurrencies.map(currency => (
                                    <Field
                                        key={currency.value}
                                        component={CurrencyRadioButton}
                                        name='currency'
                                        id={currency.value}
                                        label={currency.name}
                                        icon={currency.icon}
                                        second_line_label={currency.second_line_label}
                                        onClick={currency.onClick}
                                        selected={
                                            currency.is_disabled || deposit_target === routes.cashier_pa
                                                ? !currency.has_payment_agent
                                                : false
                                        }
                                    />
                                ))}
                            </CurrencyRadioButtonGroup>
                        )}
                    </ThemedScrollbars>
                    <FormSubmitButton
                        className='currency-selector__button'
                        is_disabled={isSubmitting || !values.currency}
                        label={localize('Continue')}
                        is_absolute
                        form_error={form_error}
                    />
                </form>
            )}
        </Formik>
    );
});

export default ChooseCurrency;

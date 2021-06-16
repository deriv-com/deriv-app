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
    setManageRealAccountActiveTabIndex,
    switchAccount,
}) => {
    const getReorderedCryptoCurrencies = () => {
        const reorderCryptoCurrencies = reorderCurrencies(
            legal_allowed_currencies.filter(
                currency =>
                    currency.type === CRYPTO_CURRENCY_TYPE &&
                    !available_crypto_currencies.some(x => x.value === currency.value)
            ),
            CRYPTO_CURRENCY_TYPE
        );
        reorderCryptoCurrencies.push({
            value: 'plus',
            name: 'Add new',
            secondLineLabel: 'crypto account',
            icon: 'IcCashierAdd',
            // onClick: () => {
            //     setManageRealAccountActiveTabIndex(1);
            //     openRealAccountSignup('manage');
            // },
        });
        return reorderCryptoCurrencies;
    };

    // const [is_loading, setIsLoading] = React.useState(false);
    // const [setError] = React.useState(null);

    // const setLoading = is_loading_val => {
    //     setIsLoading(is_loading_val);
    // };

    // const cacheFormValues = payload => {
    //     localStorage.setItem(
    //         'real_account_signup_wizard',
    //         JSON.stringify(
    //             payload.map(item => {
    //                 if (typeof item.form_value === 'object') {
    //                     return item.form_value;
    //                 }
    //                 return false;
    //             })
    //         )
    //     );
    // };

    // const showErrorModal = (err, payload) => {
    //     if (payload) {
    //         cacheFormValues(payload);
    //     }

    //     setError(err);
    // };

    const [form_error] = React.useState('');
    const [form_value] = React.useState({ crypto: '' });

    const doSwitch = async value => {
        const target_account = account_list.filter(account => account.title === value);
        const loginid = target_account.map(x => x.loginid)[0];
        await switchAccount(loginid);
    };

    const onSubmit = async obj => {
        Object.entries(obj).map(([title, value]) => {
            closeRealAccountSignup();
            if (value === 'plus') {
                setManageRealAccountActiveTabIndex(1);
                openRealAccountSignup('manage');
            } else {
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
                                // onClick={currency.onClick}
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
    setManageRealAccountActiveTabIndex: PropTypes.func,
    switchAccount: PropTypes.func,
};

export default connect(({ client, ui }) => ({
    account_list: client.account_list,
    available_crypto_currencies: client.available_crypto_currencies,
    closeRealAccountSignup: ui.closeRealAccountSignup,
    continueRouteAfterChooseCrypto: ui.continueRouteAfterChooseCrypto,
    currency_title: client.currency,
    legal_allowed_currencies: client.upgradeable_currencies,
    openRealAccountSignup: ui.openRealAccountSignup,
    setManageRealAccountActiveTabIndex: ui.setManageRealAccountActiveTabIndex,
    switchAccount: client.switchAccount,
}))(ChooseCryptoCurrency);

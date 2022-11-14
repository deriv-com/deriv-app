import classNames from 'classnames';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { Button, Icon, Input, Loading, MobileWrapper, Text } from '@deriv/components';
import { CryptoConfig, getCurrencyName, isCryptocurrency, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import CryptoFiatConverter from 'Components/crypto-fiat-converter';
import PercentageSelector from 'Components/percentage-selector';
import RecentTransaction from 'Components/recent-transaction';
import { TReactChangeEvent } from 'Types';
import { useStore } from '../../../hooks';
import './crypto-withdraw-form.scss';

type THeaderProps = {
    currency: string;
};

type TFormValues = {
    address: string;
};

const MIN_ADDRESS_LENGTH = 25;
const MAX_ADDRESS_LENGTH = 64;
const DEFAULT_FIAT_CURRENCY = 'USD';

const Header = ({ currency }: THeaderProps) => {
    const currency_name = getCurrencyName(currency);
    const currency_display_code = CryptoConfig.get()[currency].display_code;

    return (
        <Text
            as='h2'
            color='prominent'
            weight='bold'
            align='center'
            className='cashier__header cashier__content-header'
        >
            <Localize
                i18n_default_text='Withdraw {{currency}} ({{currency_symbol}}) to your wallet'
                values={{
                    currency: currency_name,
                    currency_symbol: currency_display_code,
                }}
            />
        </Text>
    );
};

const CryptoWithdrawForm = () => {
    const {
        client,
        modules: {
            cashier: { crypto_fiat_converter, general_store, transaction_history, withdraw },
        },
    } = useStore();

    const {
        balance,
        currency,
        current_fiat_currency,
        verification_code: { payment_withdraw: verification_code },
    } = client;

    const crypto_currency = currency;

    const {
        account_platform_icon,
        blockchain_address,
        onMountCryptoWithdraw: onMountWithdraw,
        requestWithdraw,
        setBlockchainAddress,
        setWithdrawPercentageSelectorResult,
        validateWithdrawFromAmount,
        validateWithdrawToAmount,
    } = withdraw;

    const {
        converter_from_error,
        converter_to_error,
        onChangeConverterFromAmount,
        onChangeConverterToAmount,
        resetConverter,
    } = crypto_fiat_converter;

    const { is_loading, percentage, percentageSelectorSelectionStatus, should_percentage_reset } = general_store;

    const { crypto_transactions, onMount: recentTransactionOnMount } = transaction_history;

    React.useEffect(() => {
        recentTransactionOnMount();
    }, [recentTransactionOnMount]);

    React.useEffect(() => {
        onMountWithdraw(verification_code);
        return () => percentageSelectorSelectionStatus(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateAddress = (address: string): string | undefined => {
        if (!address) return localize('This field is required.');

        if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
            return localize('Your wallet address should have 25 to 64 characters.');
        }

        return undefined;
    };

    if (is_loading) return <Loading />;

    return (
        <div className='cashier__wrapper' data-testid='dt_crypto_withdraw_form'>
            {!isMobile() && <Header currency={currency} />}
            <div className={classNames({ 'crypto-withdraw-form__icon': isMobile() })}>
                <Icon icon={`IcCurrency-${account_platform_icon.toLowerCase()}`} size={isMobile() ? 64 : 128} />
            </div>
            {isMobile() && <Header currency={currency} />}
            <Formik
                initialValues={{
                    address: '',
                }}
                onSubmit={() => requestWithdraw(verification_code)}
            >
                {({
                    errors,
                    isSubmitting,
                    touched,
                    setFieldTouched,
                    handleChange,
                    handleSubmit,
                    values,
                }: FormikProps<TFormValues>) => (
                    <form className='crypto-withdraw-form' onSubmit={handleSubmit} autoComplete='off'>
                        <Field name='address' validate={validateAddress}>
                            {({ field }: FieldProps<string, TFormValues>) => (
                                <Input
                                    {...field}
                                    onChange={(e: TReactChangeEvent) => {
                                        handleChange(e);
                                        setBlockchainAddress(e.target.value);
                                        setFieldTouched('address', true, false);
                                    }}
                                    className='cashier__input withdraw__input'
                                    data-testid='dt_address_input'
                                    type='text'
                                    label={
                                        <Localize
                                            i18n_default_text='Your {{currency_symbol}} wallet address'
                                            values={{
                                                currency_symbol: currency?.toUpperCase(),
                                            }}
                                        />
                                    }
                                    error={touched.address && errors.address}
                                    required
                                    autoComplete='off'
                                />
                            )}
                        </Field>
                        <div>
                            <div className='crypto-withdraw-form__percentage-selector'>
                                <PercentageSelector
                                    amount={Number(balance)}
                                    currency={currency}
                                    getCalculatedAmount={setWithdrawPercentageSelectorResult}
                                    percentage={percentage}
                                    should_percentage_reset={should_percentage_reset}
                                />
                            </div>
                            <CryptoFiatConverter
                                from_currency={crypto_currency}
                                onChangeConverterFromAmount={onChangeConverterFromAmount}
                                onChangeConverterToAmount={onChangeConverterToAmount}
                                resetConverter={resetConverter}
                                to_currency={current_fiat_currency || DEFAULT_FIAT_CURRENCY}
                                validateFromAmount={validateWithdrawFromAmount}
                                validateToAmount={validateWithdrawToAmount}
                            />
                            <div className='crypto-withdraw-form__submit'>
                                <Button
                                    className='cashier__form-submit-button'
                                    is_disabled={
                                        !!validateAddress(values.address) ||
                                        !!converter_from_error ||
                                        !!converter_to_error ||
                                        isSubmitting ||
                                        !blockchain_address
                                    }
                                    type='submit'
                                    primary
                                    large
                                >
                                    <Localize i18n_default_text='Withdraw' />
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
            <MobileWrapper>
                {isCryptocurrency(currency) && crypto_transactions?.length ? <RecentTransaction /> : null}
            </MobileWrapper>
        </div>
    );
};

export default observer(CryptoWithdrawForm);

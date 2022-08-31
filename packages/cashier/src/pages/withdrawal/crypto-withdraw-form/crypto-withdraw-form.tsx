import classNames from 'classnames';
import React from 'react';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { Button, Icon, Input, Loading, MobileWrapper, Text } from '@deriv/components';
import { CryptoConfig, getCurrencyName, isCryptocurrency, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import CryptoFiatConverter from 'Components/crypto-fiat-converter';
import PercentageSelector from 'Components/percentage-selector';
import RecentTransaction from 'Components/recent-transaction';
import { connect } from 'Stores/connect';
import { TClientStore, TCryptoTransactionDetails, TReactChangeEvent, TRootStore } from 'Types';
import './crypto-withdraw-form.scss';

type THeaderProps = {
    currency: string;
};

type TCryptoWithdrawFormProps = {
    account_platform_icon: string;
    balance: TClientStore['balance'];
    blockchain_address: string;
    crypto_currency: TClientStore['currency'];
    crypto_transactions: TCryptoTransactionDetails[];
    converter_to_error: string;
    converter_from_error: string;
    currency: TClientStore['currency'];
    current_fiat_currency: TClientStore['current_fiat_currency'];
    is_loading: boolean;
    percentage: number;
    should_percentage_reset: boolean;
    verification_code: TClientStore['verification_code']['payment_withdraw'];
    onChangeConverterFromAmount: (
        e: React.ChangeEvent<HTMLInputElement>,
        from_currency: string,
        to_currency: string
    ) => void;
    onChangeConverterToAmount: (
        e: React.ChangeEvent<HTMLInputElement>,
        from_currency: string,
        to_currency: string
    ) => void;
    onMountWithdraw: (verification_code: string) => void;
    percentageSelectorSelectionStatus: (should_percentage_reset: boolean) => void;
    recentTransactionOnMount: () => void;
    requestWithdraw: (verification_code: string) => void;
    resetConverter: () => void;
    setBlockchainAddress: (address: string) => void;
    setWithdrawPercentageSelectorResult: (amount: string) => void;
    validateWithdrawFromAmount: () => void;
    validateWithdrawToAmount: () => void;
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

const CryptoWithdrawForm = ({
    account_platform_icon,
    balance,
    blockchain_address,
    crypto_currency,
    crypto_transactions,
    converter_from_error,
    converter_to_error,
    currency,
    current_fiat_currency,
    is_loading,
    onChangeConverterFromAmount,
    onChangeConverterToAmount,
    onMountWithdraw,
    percentage,
    percentageSelectorSelectionStatus,
    recentTransactionOnMount,
    requestWithdraw,
    resetConverter,
    setBlockchainAddress,
    setWithdrawPercentageSelectorResult,
    should_percentage_reset,
    validateWithdrawFromAmount,
    validateWithdrawToAmount,
    verification_code,
}: TCryptoWithdrawFormProps) => {
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

export default connect(({ client, modules }: TRootStore) => ({
    account_platform_icon: modules.cashier.withdraw.account_platform_icon,
    balance: client.balance,
    blockchain_address: modules.cashier.withdraw.blockchain_address,
    converter_from_error: modules.cashier.crypto_fiat_converter.converter_from_error,
    converter_to_error: modules.cashier.crypto_fiat_converter.converter_to_error,
    crypto_currency: client.currency,
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    current_fiat_currency: client.current_fiat_currency,
    is_loading: modules.cashier.general_store.is_loading,
    onChangeConverterFromAmount: modules.cashier.crypto_fiat_converter.onChangeConverterFromAmount,
    onChangeConverterToAmount: modules.cashier.crypto_fiat_converter.onChangeConverterToAmount,
    onMountWithdraw: modules.cashier.withdraw.onMountCryptoWithdraw,
    percentage: modules.cashier.general_store.percentage,
    percentageSelectorSelectionStatus: modules.cashier.general_store.percentageSelectorSelectionStatus,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    requestWithdraw: modules.cashier.withdraw.requestWithdraw,
    resetConverter: modules.cashier.crypto_fiat_converter.resetConverter,
    setBlockchainAddress: modules.cashier.withdraw.setBlockchainAddress,
    setWithdrawPercentageSelectorResult: modules.cashier.withdraw.setWithdrawPercentageSelectorResult,
    should_percentage_reset: modules.cashier.general_store.should_percentage_reset,
    validateWithdrawFromAmount: modules.cashier.withdraw.validateWithdrawFromAmount,
    validateWithdrawToAmount: modules.cashier.withdraw.validateWithdrawToAmount,
    verification_code: client.verification_code.payment_withdraw,
}))(CryptoWithdrawForm);

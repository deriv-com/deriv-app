import React from 'react';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { Button, InlineMessage, Input, Loading, Text } from '@deriv/components';
import { useExchangeRate, useGrowthbookIsOn } from '@deriv/hooks';
import { CryptoConfig, getCurrencyName } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import CryptoFiatConverter from '../../../components/crypto-fiat-converter';
import PercentageSelector from '../../../components/percentage-selector';
import { useCashierStore } from '../../../stores/useCashierStores';
import { TReactChangeEvent } from '../../../types';
import WithdrawalCryptoPriority from '../withdrawal-crypto-priority';

import './withdrawal-crypto-form.scss';

type THeaderProps = {
    currency: string;
};

type TFormValues = {
    address: string;
    priority_withdrawal: boolean;
};

const MIN_ADDRESS_LENGTH = 25;
const MAX_ADDRESS_LENGTH = 64;
const DEFAULT_FIAT_CURRENCY = 'USD';

const Header = ({ currency }: THeaderProps) => {
    const currency_name = getCurrencyName(currency);
    const currency_display_code = CryptoConfig.get()[currency].display_code;

    return (
        <>
            <Text as='h2' color='prominent' weight='bold' align='center' className='cashier__header'>
                <Localize
                    i18n_default_text='Withdraw {{currency}} ({{currency_symbol}}) to your wallet'
                    values={{
                        currency: currency_name,
                        currency_symbol: currency_display_code,
                    }}
                />
            </Text>
            <InlineMessage>
                <Text as='ul' className='withdrawal-crypto-form__inline-list' size='xxs'>
                    <li>
                        <Localize i18n_default_text='Do not enter an address linked to an initial coin offering (ICO) purchase or crowdsale. If you do, the initial coin offering (ICO) tokens will not be credited into your account.' />
                    </li>
                    <li>
                        <Localize i18n_default_text='Please note that your maximum and minimum withdrawal limits aren’t fixed. They change due to the high volatility of cryptocurrency.' />
                    </li>
                </Text>
            </InlineMessage>
        </>
    );
};

const WithdrawalCryptoForm = observer(() => {
    const [arrow_icon_direction, setArrowIconDirection] = React.useState<'right' | 'left'>('right');
    const { client } = useStore();
    const {
        balance,
        currency,
        current_fiat_currency = 'USD',
        verification_code: { payment_withdraw: verification_code },
    } = client;
    const { crypto_fiat_converter, general_store, withdraw } = useCashierStore();
    const crypto_currency = currency;
    const {
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
    const { handleSubscription } = useExchangeRate();
    const [is_priority_crypto_withdrawal_enabled, isGBLoaded] = useGrowthbookIsOn({
        featureFlag: 'priority_crypto_withdrawal',
    });

    React.useEffect(() => {
        if (current_fiat_currency && crypto_currency) {
            const is_arrow_right = arrow_icon_direction === 'right';
            const base_currency = is_arrow_right ? crypto_currency : current_fiat_currency;
            const target_currency = is_arrow_right ? current_fiat_currency : crypto_currency;
            handleSubscription(base_currency, target_currency);
        }
    }, [current_fiat_currency, crypto_currency, handleSubscription, arrow_icon_direction]);

    React.useEffect(() => {
        onMountWithdraw(verification_code);

        return () => {
            percentageSelectorSelectionStatus(false);
        };
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
        <div className='withdrawal-crypto-form__wrapper' data-testid='dt_withdrawal_crypto_form'>
            <Header currency={currency} />
            <Formik
                initialValues={{
                    address: '',
                    priority_withdrawal: false,
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
                    <form className='withdrawal-crypto-form' onSubmit={handleSubmit} autoComplete='off'>
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
                                    error={touched.address ? errors.address : ''}
                                    required
                                    autoComplete='off'
                                />
                            )}
                        </Field>
                        <div className='withdrawal-crypto-form__percentage-container'>
                            <div className='withdrawal-crypto-form__percentage-selector'>
                                <PercentageSelector
                                    amount={Number(balance)}
                                    getCalculatedAmount={setWithdrawPercentageSelectorResult}
                                    percentage={percentage}
                                    should_percentage_reset={should_percentage_reset}
                                    from_currency={crypto_currency}
                                    to_currency={current_fiat_currency || DEFAULT_FIAT_CURRENCY}
                                />
                            </div>
                            <CryptoFiatConverter
                                arrow_icon_direction={arrow_icon_direction}
                                from_currency={crypto_currency}
                                onChangeConverterFromAmount={onChangeConverterFromAmount}
                                onChangeConverterToAmount={onChangeConverterToAmount}
                                resetConverter={resetConverter}
                                setArrowIconDirection={setArrowIconDirection}
                                to_currency={current_fiat_currency || DEFAULT_FIAT_CURRENCY}
                                validateFromAmount={validateWithdrawFromAmount}
                                validateToAmount={validateWithdrawToAmount}
                            />
                            {Boolean(isGBLoaded && is_priority_crypto_withdrawal_enabled) && (
                                <WithdrawalCryptoPriority />
                            )}
                            <div className='withdrawal-crypto-form__submit'>
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
        </div>
    );
});

export default WithdrawalCryptoForm;

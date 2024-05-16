import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, Formik, FormikProps } from 'formik';

import { useCryptoEstimations } from '@deriv/api';
import { Button, Checkbox, Icon, Input, Loading, Popover, Text } from '@deriv/components';
import { useCurrentAccountDetails, useExchangeRate } from '@deriv/hooks';
import { CryptoConfig, getCurrencyName, getDecimalPlaces } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

import CryptoFiatConverter from '../../../components/crypto-fiat-converter';
import PercentageSelector from '../../../components/percentage-selector';
import { useCashierStore } from '../../../stores/useCashierStores';
import { TReactChangeEvent } from '../../../types';

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

const WithdrawalCryptoForm = observer(() => {
    const [arrow_icon_direction, setArrowIconDirection] = React.useState<'right' | 'left'>('right');
    const { client, ui } = useStore();
    const { is_mobile } = ui;
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
        error,
    } = withdraw;
    const {
        converter_from_error,
        converter_from_amount,
        converter_to_error,
        onChangeConverterFromAmount,
        onChangeConverterToAmount,
        resetConverter,
    } = crypto_fiat_converter;
    const { is_loading, percentage, percentageSelectorSelectionStatus, should_percentage_reset } = general_store;
    const account_details = useCurrentAccountDetails();
    const { handleSubscription } = useExchangeRate();
    const {
        getCryptoEstimations,
        error: crypto_estimation_error,
        crypto_estimations_fee,
        crypto_estimations_fee_unique_id,
        count_down,
        serve_time,
    } = useCryptoEstimations();
    const [priority_withdrawal_checkbox, setPriorityWithdrawalCheckbox] = React.useState(false);
    const decimal_places = getDecimalPlaces(currency);

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

    React.useEffect(() => {
        if (crypto_estimation_error) {
            error.setErrorMessage({ code: crypto_estimation_error.code, message: crypto_estimation_error.message });
            setPriorityWithdrawalCheckbox(!priority_withdrawal_checkbox);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crypto_estimation_error]);

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
            {!is_mobile && <Header currency={currency} />}
            <div className={classNames({ 'withdrawal-crypto-form__icon': is_mobile })}>
                <Icon icon={`IcCurrency-${account_details?.icon?.toLowerCase()}`} size={is_mobile ? 64 : 128} />
            </div>
            {is_mobile && <Header currency={currency} />}
            <Formik
                initialValues={{
                    address: '',
                    priority_withdrawal: false,
                }}
                onSubmit={() =>
                    requestWithdraw(
                        verification_code,
                        priority_withdrawal_checkbox ? crypto_estimations_fee_unique_id : undefined
                    )
                }
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
                            <div className='withdrawal-crypto-form__priority-withdrawal-checkbox-div'>
                                <Checkbox
                                    name='priority_withdrawal'
                                    onChange={() => {
                                        if (!priority_withdrawal_checkbox) {
                                            getCryptoEstimations(currency);
                                        }
                                        setPriorityWithdrawalCheckbox(!priority_withdrawal_checkbox);
                                    }}
                                    label={localize('Priority withdrawal')}
                                    value={priority_withdrawal_checkbox}
                                />
                                <Popover
                                    message={
                                        <Localize i18n_default_text='Pay a small fee to prioritise your withdrawal, this fee will be deducted from the withdrawal amount.' />
                                    }
                                    zIndex='9999'
                                    alignment='top'
                                    icon='info'
                                    disable_message_icon
                                />
                            </div>
                            {priority_withdrawal_checkbox && crypto_estimations_fee_unique_id && (
                                <div className='withdrawal-crypto-form__priority-withdrawal-info'>
                                    <div className='withdrawal-crypto-form__priority-withdrawal-info--flex'>
                                        <Text as='p' size='xxs' line_height='l'>
                                            <Localize i18n_default_text='Withdrawal amount:' />
                                        </Text>
                                        <Text as='p' size='xxs' line_height='l'>
                                            {Number(converter_from_amount).toFixed(decimal_places)} {currency}
                                        </Text>
                                    </div>
                                    <div className='withdrawal-crypto-form__priority-withdrawal-info--flex'>
                                        <Text as='p' size='xxs' line_height='l'>
                                            <Localize i18n_default_text='Transaction fee' />
                                            <Text as='span' size='xxs' line_height='l' weight='lighter'>
                                                ({count_down}s)
                                            </Text>
                                            :
                                        </Text>
                                        <Popover
                                            message={
                                                <Localize
                                                    i18n_default_text='Fee calculated at {{ time_stamp }}'
                                                    values={{
                                                        time_stamp: serve_time,
                                                    }}
                                                />
                                            }
                                            zIndex='9999'
                                            alignment='top'
                                            icon='info'
                                            disable_target_icon
                                            disable_message_icon
                                        >
                                            <Text
                                                as='p'
                                                size='xxs'
                                                line_height='l'
                                                className='text-decoration-underline '
                                            >
                                                {Number(crypto_estimations_fee).toFixed(decimal_places)} {currency}
                                            </Text>
                                        </Popover>
                                    </div>
                                    <hr className='withdrawal-crypto-form__priority-withdrawal-info-divider' />
                                    <div className='withdrawal-crypto-form__priority-withdrawal-info--flex'>
                                        <Text as='p' size='xxs' line_height='l'>
                                            <Localize i18n_default_text='Amount received:' />
                                        </Text>
                                        <Text as='p' size='xxs' line_height='l' weight='bold'>
                                            {Number(converter_from_amount)
                                                ? (
                                                      parseFloat(
                                                          Number(converter_from_amount).toFixed(decimal_places)
                                                      ) - Number(crypto_estimations_fee)
                                                  ).toFixed(decimal_places)
                                                : Number(converter_from_amount).toFixed(decimal_places)}{' '}
                                            {currency}
                                        </Text>
                                    </div>
                                </div>
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

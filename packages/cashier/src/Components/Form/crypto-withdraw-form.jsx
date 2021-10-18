import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, Input, Loading, MobileWrapper, Text } from '@deriv/components';
import { CryptoConfig, getCurrencyName, isCryptocurrency, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { Field, Formik } from 'formik';
import { connect } from 'Stores/connect';
import RecentTransaction from 'Components/recent-transaction.jsx';
import CryptoFiatConverter from './crypto-fiat-converter.jsx';
import PercentageSelector from '../percentage-selector';
import '../../Sass/withdraw.scss';

const MIN_ADDRESS_LENGTH = 25;
const MAX_ADDRESS_LENGTH = 64;
const DEFAULT_FIAT_CURRENCY = 'USD';

const Header = ({ currency }) => {
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
    onMountWithdraw,
    percentage,
    percentageSelectorSelectionStatus,
    recentTransactionOnMount,
    requestWithdraw,
    setBlockchainAddress,
    setWithdrawPercentageSelectorResult,
    should_percentage_reset,
    validateWithdrawFromAmount,
    validateWithdrawToAmount,
    verification_code,
}) => {
    React.useEffect(() => {
        recentTransactionOnMount();
    }, [recentTransactionOnMount]);

    React.useEffect(() => {
        onMountWithdraw(verification_code);
        return () => percentageSelectorSelectionStatus(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateAddress = address => {
        if (!address) return localize('This field is required.');

        if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
            return localize('Your wallet address should have 25 to 64 characters.');
        }

        return undefined;
    };

    if (is_loading) return <Loading />;

    return (
        <div className='cashier__wrapper withdraw__wrapper'>
            {!isMobile() && <Header currency={currency} />}
            <div className='withdraw__form-icon'>
                <Icon icon={`IcCurrency-${account_platform_icon.toLowerCase()}`} size={isMobile() ? 64 : 128} />
            </div>
            {isMobile() && <Header currency={currency} />}
            <Formik
                initialValues={{
                    address: '',
                }}
            >
                {({ errors, isSubmitting, touched, setFieldTouched, handleChange, values }) => (
                    <div className='withdraw__form'>
                        <Field name='address' validate={validateAddress}>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    onChange={e => {
                                        handleChange(e);
                                        setBlockchainAddress(e.target.value);
                                        setFieldTouched('address', true, false);
                                    }}
                                    className='cashier__input withdraw__input'
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
                        <div className='withdraw__percentage-selector'>
                            <PercentageSelector
                                amount={+balance}
                                currency={currency}
                                getCalculatedAmount={setWithdrawPercentageSelectorResult}
                                percentage={percentage}
                                should_percentage_reset={should_percentage_reset}
                            />
                        </div>
                        <div className='withdraw__crypto-fiat-converter'>
                            <CryptoFiatConverter
                                from_currency={crypto_currency}
                                to_currency={current_fiat_currency || DEFAULT_FIAT_CURRENCY}
                                validateFromAmount={validateWithdrawFromAmount}
                                validateToAmount={validateWithdrawToAmount}
                            />
                        </div>
                        <div className='withdraw__form-submit'>
                            <Button
                                className='cashier__form-submit-button'
                                is_disabled={
                                    validateAddress(values.address) ||
                                    !!converter_from_error ||
                                    !!converter_to_error ||
                                    isSubmitting ||
                                    !blockchain_address
                                }
                                type='submit'
                                primary
                                large
                                onClick={() => requestWithdraw(verification_code)}
                            >
                                <Localize i18n_default_text='Withdraw' />
                            </Button>
                        </div>
                    </div>
                )}
            </Formik>
            <MobileWrapper>
                {isCryptocurrency(currency) && crypto_transactions?.length ? <RecentTransaction /> : null}
            </MobileWrapper>
        </div>
    );
};

CryptoWithdrawForm.propTypes = {
    account_platform_icon: PropTypes.string,
    balance: PropTypes.number,
    blockchain_address: PropTypes.string,
    converter_from_error: PropTypes.string,
    converter_to_error: PropTypes.string,
    crypto_currency: PropTypes.string,
    crypto_transactions: PropTypes.array,
    currency: PropTypes.string,
    current_fiat_currency: PropTypes.string,
    is_loading: PropTypes.bool,
    onMountWithdraw: PropTypes.func,
    percentage: PropTypes.number,
    percentageSelectorSelectionStatus: PropTypes.func,
    requestWithdraw: PropTypes.func,
    recentTransactionOnMount: PropTypes.func,
    setBlockchainAddress: PropTypes.func,
    setWithdrawPercentageSelectorResult: PropTypes.func,
    should_percentage_reset: PropTypes.bool,
    validateWithdrawFromAmount: PropTypes.func,
    validateWithdrawToAmount: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    account_platform_icon: modules.cashier.account_platform_icon,
    balance: client.balance,
    blockchain_address: modules.cashier.blockchain_address,
    converter_from_error: modules.cashier.converter_from_error,
    converter_to_error: modules.cashier.converter_to_error,
    crypto_currency: client.currency,
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    current_fiat_currency: client.current_fiat_currency,
    is_loading: modules.cashier.is_loading,
    onMountWithdraw: modules.cashier.onMountWithdraw,
    percentage: modules.cashier.percentage,
    percentageSelectorSelectionStatus: modules.cashier.percentageSelectorSelectionStatus,
    requestWithdraw: modules.cashier.requestWithdraw,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    setBlockchainAddress: modules.cashier.setBlockchainAddress,
    setWithdrawPercentageSelectorResult: modules.cashier.setWithdrawPercentageSelectorResult,
    should_percentage_reset: modules.cashier.should_percentage_reset,
    validateWithdrawFromAmount: modules.cashier.validateWithdrawFromAmount,
    validateWithdrawToAmount: modules.cashier.validateWithdrawToAmount,
    verification_code: client.verification_code.payment_withdraw,
}))(CryptoWithdrawForm);

import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, Input, Text } from '@deriv/components';
import { CryptoConfig, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { Field, Formik } from 'formik';
import { connect } from 'Stores/connect';
import CryptoFiatConverter from './crypto-fiat-converter.jsx';
import PercentageSelector from '../percentage-selector';
import '../../Sass/withdraw.scss';

const MIN_ADDRESS_LENGTH = 25;

const Header = ({ currency }) => {
    const currency_name = CryptoConfig.get()[currency].name;

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
                    currency_symbol: currency?.toUpperCase(),
                }}
            />
        </Text>
    );
};

const CryptoWithdrawForm = ({
    account_platform_icon,
    balance,
    blockchain_address,
    crypto_amount,
    crypto_converter_error,
    currency,
    fiat_converter_error,
    has_invalid_crypto_address,
    requestWithdraw,
    setBlockchainAddress,
    setPercentageSelectorResult,
    verification_code,
    setInvalidCryptoAddress,
}) => {
    const validateAddress = address => {
        if (!address) return localize('This field is required.');

        if (address.length < MIN_ADDRESS_LENGTH) {
            return localize('Your wallet address should have 25 characters or more.');
        }

        return undefined;
    };

    return (
        <div className='cashier__wrapper withdraw__wrapper'>
            {isMobile() && <Header currency={currency} />}
            {!isMobile() && <Header currency={currency} />}
            <div className='withdraw__form-icon'>
                <Icon icon={`IcCurrency-${account_platform_icon.toLowerCase()}`} size={isMobile() ? 64 : 128} />
            </div>
            <Formik
                initialValues={{
                    address: '',
                }}
            >
                {({ errors, isSubmitting, isValid, touched, setFieldTouched, handleChange }) => (
                    <div className='withdraw__form'>
                        <Field name='address' validate={validateAddress}>
                            {({ field }) => (
                                <Input
                                    {...field}
                                    onChange={e => {
                                        handleChange(e);
                                        setBlockchainAddress(e.target.value);
                                        setFieldTouched('address', true, false);
                                        setInvalidCryptoAddress(false);
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
                                    error={
                                        touched.address && errors.address
                                            ? errors.address
                                            : (has_invalid_crypto_address &&
                                                  localize('Please enter a valid wallet address.')) ||
                                              ''
                                    }
                                    required
                                    autoComplete='off'
                                />
                            )}
                        </Field>
                        <div className='withdraw__percentage-selector'>
                            <PercentageSelector
                                amount={+balance}
                                currency={currency}
                                getCalculatedAmount={setPercentageSelectorResult}
                            />
                        </div>
                        <div className='withdraw__crypto-fiat-converter'>
                            <CryptoFiatConverter required />
                        </div>
                        <div className='withdraw__form-submit'>
                            <Button
                                className='cashier__form-submit-button'
                                is_disabled={
                                    !isValid ||
                                    !!crypto_converter_error ||
                                    !!fiat_converter_error ||
                                    isSubmitting ||
                                    !blockchain_address ||
                                    !crypto_amount
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
        </div>
    );
};

CryptoWithdrawForm.propTypes = {
    account_platform_icon: PropTypes.string,
    balance: PropTypes.number,
    blockchain_address: PropTypes.string,
    crypto_amount: PropTypes.string,
    crypto_converter_error: PropTypes.string,
    currency: PropTypes.string,
    fiat_converter_error: PropTypes.string,
    has_invalid_crypto_address: PropTypes.bool,
    requestWithdraw: PropTypes.func,
    setBlockchainAddress: PropTypes.func,
    setInvalidCryptoAddress: PropTypes.func,
    setPercentageSelectorResult: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    account_platform_icon: modules.cashier.account_platform_icon,
    balance: client.balance,
    blockchain_address: modules.cashier.blockchain_address,
    crypto_amount: modules.cashier.crypto_amount,
    crypto_converter_error: modules.cashier.crypto_converter_error,
    currency: client.currency,
    fiat_converter_error: modules.cashier.fiat_converter_error,
    has_invalid_crypto_address: modules.cashier.config.withdraw.has_invalid_crypto_address,
    requestWithdraw: modules.cashier.requestWithdraw,
    setBlockchainAddress: modules.cashier.setBlockchainAddress,
    setInvalidCryptoAddress: modules.cashier.config.withdraw.setInvalidCryptoAddress,
    setPercentageSelectorResult: modules.cashier.setPercentageSelectorResult,
    verification_code: client.verification_code.payment_withdraw,
}))(CryptoWithdrawForm);

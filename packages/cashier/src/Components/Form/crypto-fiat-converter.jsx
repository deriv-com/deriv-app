import PropTypes from 'prop-types';
import React from 'react';
import { Field, Form, Formik } from 'formik';
import { DesktopWrapper, Input, Icon, MobileWrapper, Text } from '@deriv/components';
import { getDecimalPlaces, validNumber } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { useInterval } from '@deriv/components/src/hooks';

const Timer = props => {
    const initial_time = 60;
    const [remaining_time, setRemainingTime] = React.useState(initial_time);

    useInterval(() => {
        if (remaining_time > 0) {
            setRemainingTime(remaining_time - 1);
        }
    }, 1000);
    React.useEffect(() => {
        if (remaining_time === 0) {
            props.onComplete();
            setRemainingTime(initial_time);
        }
    });

    return (
        <Text as='p' size='xs' className='timer'>
            <Localize i18n_default_text='{{remaining_time}}s' values={{ remaining_time }} />
        </Text>
    );
};

const InputGroup = ({ children, className }) => {
    return (
        <fieldset>
            <div className={className}>{children}</div>
        </fieldset>
    );
};

const CryptoFiatConverter = ({
    balance,
    crypto_amount,
    crypto_currency,
    current_fiat_currency,
    fiat_amount,
    insufficient_fund_error,
    is_timer_visible,
    onChangeCryptoAmount,
    onChangeFiatAmount,
    setCryptoAmount,
    setFiatAmount,
    setIsTimerVisible,
}) => {
    const [arrow_icon_direction, setArrowIconDirection] = React.useState('right');
    const validateCryptoAmount = amount => {
        if (amount) {
            const { is_ok, message } = validNumber(amount, {
                type: 'float',
                decimals: getDecimalPlaces(crypto_currency),
            });
            if (!is_ok) return message;

            if (+balance < +amount) return localize('Insufficient funds');
        }

        return undefined;
    };
    const validateFiatAmount = amount => {
        if (amount) {
            const { is_ok, message } = validNumber(amount, {
                type: 'float',
                decimals: getDecimalPlaces(current_fiat_currency),
            });
            if (!is_ok) return message;
        }

        return undefined;
    };

    return (
        <Formik
            initialValues={{
                crypto_amount: '',
                fiat_amount: '',
            }}
        >
            {({ errors, values, touched, handleBlur, handleChange, setFieldError }) => (
                <Form className='crypto-fiat-converter-form'>
                    <Field name='crypto_amount' validate={validateCryptoAmount}>
                        {({ field }) => (
                            <Input
                                {...field}
                                onFocus={() => {
                                    setArrowIconDirection('right');
                                }}
                                onBlur={e => {
                                    handleBlur(e);
                                    if (!is_timer_visible) {
                                        if (!values.crypto_amount || errors.crypto_amount) {
                                            setFiatAmount('');
                                        } else {
                                            onChangeCryptoAmount(e, crypto_currency, current_fiat_currency);
                                        }
                                    }
                                }}
                                onChange={e => {
                                    setIsTimerVisible(false);
                                    handleChange(e);
                                    setCryptoAmount(e.target.value);
                                    setFieldError('fiat_amount', '');
                                }}
                                type='text'
                                error={touched.crypto_amount && errors.crypto_amount && insufficient_fund_error}
                                label={localize('Amount ({{currency}})', { currency: crypto_currency })}
                                value={crypto_amount}
                            />
                        )}
                    </Field>
                    <MobileWrapper>
                        {arrow_icon_direction === 'right' ? (
                            <Icon icon='IcArrowDownBold' />
                        ) : (
                            <Icon icon='IcArrowUpBold' />
                        )}
                    </MobileWrapper>
                    <DesktopWrapper>
                        {arrow_icon_direction === 'right' ? (
                            <Icon icon='IcArrowRightBold' />
                        ) : (
                            <Icon icon='IcArrowLeftBold' />
                        )}
                    </DesktopWrapper>
                    <Field name='fiat_amount' validate={validateFiatAmount}>
                        {({ field }) => (
                            <InputGroup className='input-group'>
                                <Input
                                    {...field}
                                    onFocus={() => {
                                        setArrowIconDirection('left');
                                    }}
                                    onBlur={e => {
                                        handleBlur(e);
                                        if (!is_timer_visible) {
                                            if (!values.fiat_amount || errors.fiat_amount) {
                                                setCryptoAmount('');
                                            } else {
                                                onChangeFiatAmount(e, current_fiat_currency, crypto_currency);
                                            }
                                        }
                                    }}
                                    onChange={e => {
                                        setIsTimerVisible(false);
                                        handleChange(e);
                                        setFiatAmount(e.target.value);
                                        setFieldError('crypto_amount', '');
                                    }}
                                    type='text'
                                    error={touched.fiat_amount && errors.fiat_amount}
                                    label={localize('Amount ({{currency}})', { currency: current_fiat_currency })}
                                    value={fiat_amount}
                                />
                                {is_timer_visible && (
                                    <Timer
                                        onComplete={() => {
                                            onChangeCryptoAmount(
                                                {
                                                    target: {
                                                        value: crypto_amount,
                                                    },
                                                },
                                                crypto_currency,
                                                current_fiat_currency
                                            );
                                        }}
                                    />
                                )}
                            </InputGroup>
                        )}
                    </Field>
                    <Text as='p' size='xxs'>
                        <Localize i18n_default_text='Approximate value' />
                    </Text>
                </Form>
            )}
        </Formik>
    );
};

CryptoFiatConverter.propTypes = {
    balance: PropTypes.string,
    crypto_amount: PropTypes.string,
    crypto_currency: PropTypes.string,
    current_fiat_currency: PropTypes.string,
    fiat_amount: PropTypes.string,
    insufficient_fund_error: PropTypes.string,
    is_timer_visible: PropTypes.bool,
    onChangeCryptoAmount: PropTypes.func,
    onChangeFiatAmount: PropTypes.func,
    setCryptoAmount: PropTypes.func,
    setFiatAmount: PropTypes.func,
    setIsTimerVisible: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    balance: client.balance,
    crypto_amount: modules.cashier.crypto_amount,
    crypto_currency: client.currency,
    current_fiat_currency: client.current_fiat_currency,
    fiat_amount: modules.cashier.fiat_amount,
    insufficient_fund_error: modules.cashier.insufficient_fund_error,
    is_timer_visible: modules.cashier.is_timer_visible,
    onChangeCryptoAmount: modules.cashier.onChangeCryptoAmount,
    onChangeFiatAmount: modules.cashier.onChangeFiatAmount,
    setCryptoAmount: modules.cashier.setCryptoAmount,
    setFiatAmount: modules.cashier.setFiatAmount,
    setIsTimerVisible: modules.cashier.setIsTimerVisible,
}))(CryptoFiatConverter);

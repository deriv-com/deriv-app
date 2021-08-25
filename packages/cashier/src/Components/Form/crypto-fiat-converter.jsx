import PropTypes from 'prop-types';
import React from 'react';
import { Field, useFormikContext} from 'formik';
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
    crypto_amount,
    crypto_fiat_converter_error,
    fiat_amount,
    from_currency,
    hint,
    is_timer_visible,
    onChangeCryptoAmount,
    onChangeFiatAmount,
    resetTimer,
    setCryptoAmount,
    setFiatAmount,
    setIsTimerVisible,
    to_currency,
    validateFromAmount,
}) => {
    const { errors, touched, handleBlur, handleChange, setFieldError } = useFormikContext();
    const [arrow_icon_direction, setArrowIconDirection] = React.useState('right');

    const validateToAmount = amount => {
        if (amount) {
            const { is_ok, message } = validNumber(amount, {
                type: 'float',
                decimals: getDecimalPlaces(to_currency),
            });
            if (!is_ok) return message;
        }
    
        return undefined;
    };

    React.useEffect(() => {
        return () => resetTimer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setArrowIconDirection('right');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [from_currency]);

    return (
        <div className='crypto-fiat-converter-form'>
            <Field name='crypto_amount' validate={validateFromAmount}>
                {({ field }) => (
                    <Input
                        {...field}
                        onFocus={() =>{
                            setArrowIconDirection('right'); 
                        }}
                        onBlur={e => {
                            handleBlur(e);
                            onChangeCryptoAmount(e, from_currency, to_currency);
                            setFieldError('fiat_amount', '');
                        }}
                        onChange={e => {
                            setFieldError('crypto_amount', '');
                            setIsTimerVisible(false);
                            handleChange(e);
                            setCryptoAmount(e.target.value);   
                        }}
                        type='text'
                        error={touched.crypto_amount && errors.crypto_amount || crypto_fiat_converter_error}
                        label={localize('Amount ({{currency}})', {currency: from_currency})}
                        value={crypto_amount}
                        autoComplete='off'
                        required
                        hint={hint}
                    />
                )}
            </Field>
            <MobileWrapper>
                {arrow_icon_direction === 'right' ? <Icon icon='IcArrowDownBold' /> : <Icon icon='IcArrowUpBold' />}
            </MobileWrapper>
            <DesktopWrapper>
                {arrow_icon_direction === 'right' ? <Icon icon='IcArrowRightBold' /> : <Icon icon='IcArrowLeftBold' />}
            </DesktopWrapper>
            <Field name='fiat_amount' validate={validateToAmount}>
                {({ field }) => (
                    <InputGroup className='input-group'>
                        <Input
                            {...field}
                            onFocus={() =>{
                                setArrowIconDirection('left'); 
                            }}
                            onBlur={e => {
                                handleBlur(e);
                                onChangeFiatAmount(e, to_currency, from_currency);
                                setFieldError('crypto_amount', '');    
                            }}
                            onChange={e => {
                                setFieldError('fiat_amount', '');
                                setIsTimerVisible(false);
                                handleChange(e);
                                setFiatAmount(e.target.value);       
                            }}
                            type='text'
                            error={touched.fiat_amount && errors.fiat_amount}
                            label={localize('Amount ({{currency}})', {currency: to_currency})}
                            value={fiat_amount}
                            autoComplete='off'
                        />
                        {is_timer_visible && <Timer onComplete={() => {
                            onChangeCryptoAmount({
                                target: {
                                    value: crypto_amount,
                                },
                            }, from_currency, to_currency);
                        }} /> }
                    </InputGroup>
                )}
            </Field>
            <Text as='p' size='xxs' className='crypto-fiat-converter-form__text'>
                <Localize i18n_default_text='Approximate value' />
            </Text>
        </div>
    );
};

CryptoFiatConverter.propTypes = {
    crypto_amount: PropTypes.string,
    crypto_fiat_converter_error: PropTypes.string,
    fiat_amount: PropTypes.string,
    from_currency: PropTypes.string,
    is_timer_visible: PropTypes.bool,
    onChangeCryptoAmount: PropTypes.func,
    onChangeFiatAmount: PropTypes.func,
    resetTimer: PropTypes.func,
    setCryptoAmount: PropTypes.func,
    setFiatAmount: PropTypes.func,
    setIsTimerVisible: PropTypes.func,
    to_currency: PropTypes.string,
    validateFromAmount: PropTypes.func,
};

export default connect(({ modules }) => ({
    crypto_amount: modules.cashier.crypto_amount,
    crypto_fiat_converter_error: modules.cashier.crypto_fiat_converter_error,
    fiat_amount: modules.cashier.fiat_amount,
    is_timer_visible: modules.cashier.is_timer_visible,
    onChangeCryptoAmount: modules.cashier.onChangeCryptoAmount,
    onChangeFiatAmount: modules.cashier.onChangeFiatAmount,
    resetTimer: modules.cashier.resetTimer,
    setCryptoAmount: modules.cashier.setCryptoAmount,
    setFiatAmount: modules.cashier.setFiatAmount,
    setIsTimerVisible: modules.cashier.setIsTimerVisible,
}))(CryptoFiatConverter);

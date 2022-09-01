import PropTypes from 'prop-types';
import React from 'react';
import { Field, useFormikContext } from 'formik';
import { DesktopWrapper, Input, Icon, MobileWrapper, Text } from '@deriv/components';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { useInterval } from '@deriv/components/src/hooks';
import './crypto-fiat-converter.scss';

const Timer = ({ onComplete }) => {
    const initial_time = 60;
    const [remaining_time, setRemainingTime] = React.useState(initial_time);

    useInterval(() => {
        if (remaining_time > 0) {
            setRemainingTime(remaining_time - 1);
        }
    }, 1000);
    React.useEffect(() => {
        if (remaining_time === 0) {
            onComplete();
            setRemainingTime(initial_time);
        }
    }, [onComplete, remaining_time]);

    return (
        <Text as='p' size='xs' color='less-prominent' className='timer'>
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
    converter_from_amount,
    converter_from_error,
    converter_to_error,
    converter_to_amount,
    from_currency,
    hint,
    is_timer_visible,
    onChangeConverterFromAmount,
    onChangeConverterToAmount,
    resetConverter,
    to_currency,
    validateFromAmount,
    validateToAmount,
}) => {
    const { handleChange } = useFormikContext();
    const [arrow_icon_direction, setArrowIconDirection] = React.useState('right');

    React.useEffect(() => {
        return () => resetConverter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setArrowIconDirection('right');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [from_currency]);

    return (
        <div className='crypto-fiat-converter'>
            <Field name='converter_from_amount' validate={validateFromAmount}>
                {({ field }) => (
                    <Input
                        {...field}
                        onFocus={() => {
                            setArrowIconDirection('right');
                        }}
                        onChange={e => {
                            onChangeConverterFromAmount(e, from_currency, to_currency);
                            handleChange(e);
                        }}
                        type='text'
                        error={converter_from_error}
                        label={localize('Amount ({{currency}})', { currency: getCurrencyDisplayCode(from_currency) })}
                        value={converter_from_amount}
                        autoComplete='off'
                        required
                        hint={hint}
                        classNameHint='crypto-fiat-converter__hint'
                    />
                )}
            </Field>
            <MobileWrapper>
                {arrow_icon_direction === 'right' ? <Icon icon='IcArrowDownBold' /> : <Icon icon='IcArrowUpBold' />}
            </MobileWrapper>
            <DesktopWrapper>
                {arrow_icon_direction === 'right' ? (
                    <Icon icon='IcArrowRightBold' id='arrow_right_bold' />
                ) : (
                    <Icon icon='IcArrowLeftBold' id='arrow_left_bold' />
                )}
            </DesktopWrapper>
            <Field name='converter_to_amount' validate={validateToAmount}>
                {({ field }) => (
                    <InputGroup className='input-group'>
                        <Input
                            {...field}
                            onFocus={() => {
                                setArrowIconDirection('left');
                            }}
                            onChange={e => {
                                onChangeConverterToAmount(e, to_currency, from_currency);
                                handleChange(e);
                            }}
                            type='text'
                            error={converter_to_error}
                            label={localize('Amount ({{currency}})', { currency: getCurrencyDisplayCode(to_currency) })}
                            value={converter_to_amount}
                            autoComplete='off'
                            hint={localize('Approximate value')}
                            classNameHint='crypto-fiat-converter__hint'
                        />
                        {is_timer_visible && (
                            <Timer
                                onComplete={() => {
                                    onChangeConverterFromAmount(
                                        {
                                            target: {
                                                value: converter_from_amount,
                                            },
                                        },
                                        from_currency,
                                        to_currency
                                    );
                                }}
                            />
                        )}
                    </InputGroup>
                )}
            </Field>
        </div>
    );
};

CryptoFiatConverter.propTypes = {
    converter_from_amount: PropTypes.string,
    converter_from_error: PropTypes.string,
    converter_to_error: PropTypes.string,
    converter_to_amount: PropTypes.string,
    from_currency: PropTypes.string,
    hint: PropTypes.string,
    is_timer_visible: PropTypes.bool,
    onChangeConverterFromAmount: PropTypes.func,
    onChangeConverterToAmount: PropTypes.func,
    resetConverter: PropTypes.func,
    to_currency: PropTypes.string,
    validateFromAmount: PropTypes.func,
    validateToAmount: PropTypes.func,
};

export default connect(({ modules }) => ({
    converter_from_amount: modules.cashier.crypto_fiat_converter.converter_from_amount,
    converter_from_error: modules.cashier.crypto_fiat_converter.converter_from_error,
    converter_to_error: modules.cashier.crypto_fiat_converter.converter_to_error,
    converter_to_amount: modules.cashier.crypto_fiat_converter.converter_to_amount,
    is_timer_visible: modules.cashier.crypto_fiat_converter.is_timer_visible,
}))(CryptoFiatConverter);

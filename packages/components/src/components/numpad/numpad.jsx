import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import NumberGrid from './number-grid.jsx';
import StepInput from './step-input.jsx';
import Text from '../text';
import Button from '../button/button';
import { useLongPress } from '../../hooks';

const concatenate = (number, default_value) => default_value.toString().concat(number);
const Numpad = ({
    className,
    currency,
    is_regular,
    is_currency,
    is_submit_disabled,
    label,
    reset_press_interval,
    reset_value,
    max = 9999999,
    min = 0,
    pip_size,
    onSubmit,
    render,
    submit_label = 'OK',
    value,
    format,
    onValueChange,
    onValidate,
}) => {
    const formatNumber = v => (typeof format === 'function' ? format(v) : v);
    const isFloat = v => String(v).match(/\./);
    const formatted_value = formatNumber(value);
    const [is_float, setFloat] = React.useState(isFloat(formatted_value));
    const [default_value, setValue] = React.useState(formatted_value);
    const [has_error, setHasError] = React.useState(false);

    React.useEffect(() => {
        if (formatted_value !== formatNumber(default_value)) {
            updateValue(value);
            setFloat(isFloat(value));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    React.useEffect(() => {
        const is_error = !onValidate(default_value) || onValidate(default_value) === 'error';
        setHasError(is_error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [default_value, value]);

    const updateValue = val => {
        setValue(val);
        if (onValueChange) onValueChange(val);
    };

    const onSelect = num => {
        switch (num) {
            // backspace
            case -1:
                chop();
                break;

            // detecting floating point
            case '.':
                if (is_float) {
                    break;
                }
                setFloat(true);
                if (default_value.length === 0) {
                    updateValue(concatenate(num, '0'));
                } else {
                    updateValue(concatenate(num, default_value));
                }

                break;
            default:
                if (String(default_value) === '0') {
                    updateValue(concatenate(num, ''));
                } else {
                    const regex = /(?:\d+\.)(\d+)$/;
                    const matches = regex.exec(default_value);

                    if (matches !== null && is_float) {
                        matches.forEach((match, groupIndex) => {
                            const pip_size_allowed = groupIndex === 1 && match.length < pip_size && is_float;
                            if (pip_size_allowed) {
                                updateValue(concatenate(num, default_value));
                            }
                        });
                    } else if (concatenate(num, default_value) <= max) {
                        updateValue(concatenate(num, default_value));
                    }
                }
        }
    };

    const getDecimals = val => {
        const array_value = typeof val === 'string' ? val.split('.') : val.toString().split('.');
        return array_value && array_value.length > 1 ? array_value[1].length : 0;
    };

    const chop = () => {
        if (default_value.toString().slice(-1) === '.') {
            setFloat(false);
        }
        updateValue(default_value.toString().slice(0, -1));
    };

    const is_default_enabled = ![!!is_regular, !!is_currency].includes(true);
    React.useEffect(() => {
        if (is_currency && typeof pip_size === 'undefined') {
            // eslint-disable-next-line no-console
            console.error("Warning: property pip_size is required when using currency type <Numpad pip_size='2' />");
        }
    });

    const is_backspace_disabled = !default_value.toString().length;

    /**
     * Add Long Touch Handler
     */
    const clearValue = () => {
        if (is_float) setFloat(false);
        updateValue(reset_value || '');
    };
    const backspaceLongPress = useLongPress(clearValue, reset_press_interval);

    const is_button_disabled =
        is_submit_disabled || !default_value.toString().length || (min && formatNumber(default_value) < min);

    return (
        <div
            className={classNames('dc-numpad', className, {
                'dc-numpad--is-regular': is_regular || is_default_enabled,
                'dc-numpad--is-currency': is_currency && !is_default_enabled,
            })}
        >
            <StepInput
                className={has_error ? 'dc-numpad__input-field--has-error' : null}
                currency={currency}
                pip_size={pip_size}
                value={default_value}
                render={render}
                onChange={v => {
                    const amount = Number(v).toFixed(getDecimals(default_value));
                    setFloat(isFloat(amount));
                    updateValue(amount);
                }}
                min={min}
                max={max}
                label={label}
            />
            <NumberGrid onSelect={onSelect} />
            {is_currency && (
                <Button
                    type='secondary'
                    className='dc-numpad__number'
                    has_effect
                    onClick={() => onSelect('.')}
                    text='.'
                    renderText={text => (
                        <Text styles={{ fontSize: '1.8rem' }} weight='bold' align='center'>
                            {text}
                        </Text>
                    )}
                />
            )}
            <div className='dc-numpad__bkspace'>
                <Button
                    {...backspaceLongPress}
                    type='secondary'
                    has_effect
                    className='dc-numpad__number'
                    onClick={() => {
                        onSelect(-1);
                    }}
                    is_disabled={is_backspace_disabled}
                    text='⌫'
                    renderText={text => (
                        <Text weight='bold' align='center' color={is_backspace_disabled ? 'disabled' : 'general'}>
                            {text}
                        </Text>
                    )}
                />
            </div>

            <div className='dc-numpad__ok'>
                <Button
                    type='secondary'
                    has_effect
                    className={classNames('dc-numpad__number', {
                        'dc-numpad__number--is-disabled':
                            is_submit_disabled ||
                            !default_value.toString().length ||
                            (min && formatNumber(default_value) < min),
                    })}
                    onClick={() => {
                        if (!default_value.toString().length) return;
                        if (min && formatNumber(default_value) < min) return;
                        onSubmit(formatNumber(default_value));
                    }}
                    is_disabled={is_button_disabled}
                    text={submit_label}
                    renderText={text => (
                        <Text
                            styles={{ fontSize: '1.8rem' }}
                            weight='bold'
                            align='center'
                            color={is_button_disabled ? 'disabled' : 'general'}
                        >
                            {text}
                        </Text>
                    )}
                />
            </div>
        </div>
    );
};

Numpad.propTypes = {
    currency: PropTypes.string,
    format: PropTypes.func,
    is_currency: PropTypes.bool,
    is_regular: PropTypes.bool,
    is_submit_disabled: PropTypes.bool,
    reset_press_interval: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
    onSubmit: PropTypes.func,
    onValidate: PropTypes.func,
    pip_size: PropTypes.number,
    render: PropTypes.func,
    reset_value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    submit_label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    label: PropTypes.string,
    onValueChange: PropTypes.func,
};

export default Numpad;

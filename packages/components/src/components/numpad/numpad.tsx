import React from 'react';
import classNames from 'classnames';
import NumberGrid from './number-grid';
import StepInput from './step-input';
import Text from '../text';
import Button from '../button/button';
import { useLongPress } from '../../hooks';

type TNumpad = {
    className?: string;
    currency: string;
    is_regular?: boolean;
    is_currency?: boolean;
    is_submit_disabled?: boolean;
    label: string;
    reset_press_interval: number;
    reset_value: string;
    max: number;
    min: number;
    pip_size: number;
    onSubmit: (param: number) => void;
    v: string;
    render?: (props: { string_value: string; className: string }) => React.ReactNode;
    submit_label: string;
    value: string;
    format: (v: string) => number;
    onValueChange: (val: number | string) => void;
    onValidate: (default_value: number | string) => string | undefined;
};

const concatenate = (number: string, default_value: number) => default_value.toString().concat(number);
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
}: TNumpad) => {
    const formatNumber = (v: string) => (typeof format === 'function' ? format(v) : Number(v));
    const isFloat = (v: string) => new RegExp(/\./).test(String(v));
    const formatted_value = formatNumber(value);
    const [is_float, setFloat] = React.useState(isFloat(String(formatted_value)));
    const [default_value, setValue] = React.useState(formatted_value);
    const [has_error, setHasError] = React.useState(false);

    React.useEffect(() => {
        if (formatted_value !== formatNumber(String(default_value))) {
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

    const updateValue = (val: string) => {
        setValue(Number(val));
        if (onValueChange) onValueChange(val);
    };

    const onSelect = (num: number | string) => {
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
                if (default_value.toString().length === 0) {
                    updateValue(concatenate(num, 0));
                } else {
                    updateValue(concatenate(num, default_value));
                }

                break;
            default:
                if (String(default_value) === '0') {
                    updateValue(concatenate(String(num), 0));
                } else {
                    const regex = /(?:^\d{0,35}\.)(\d{0,35})$/;
                    const matches = regex.exec(String(default_value));

                    if (matches !== null && is_float) {
                        matches.forEach((match, groupIndex) => {
                            const pip_size_allowed = groupIndex === 1 && match.length < pip_size && is_float;
                            if (pip_size_allowed) {
                                updateValue(concatenate(String(num), default_value));
                            }
                        });
                    } else if (Number(concatenate(String(num), default_value)) <= max) {
                        updateValue(concatenate(String(num), default_value));
                    }
                }
        }
    };

    const getDecimals = (val: string | number) => {
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

    const is_button_disabled = !!(
        is_submit_disabled ||
        !default_value.toString().length ||
        (min && formatNumber(String(default_value)) < min)
    );
    return (
        <div
            className={classNames('dc-numpad', className, {
                'dc-numpad--is-regular': is_regular || is_default_enabled,
                'dc-numpad--is-currency': is_currency && !is_default_enabled,
            })}
        >
            <StepInput
                className={has_error ? 'dc-numpad__input-field--has-error' : ''}
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
            <NumberGrid onSelect={onSelect} number={0} />
            {is_currency && (
                <Button
                    type='button'
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
                    type='button'
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
                    type='button'
                    has_effect
                    className={classNames('dc-numpad__number', {
                        'dc-numpad__number--is-disabled':
                            is_submit_disabled ||
                            !default_value.toString().length ||
                            (min && formatNumber(String(default_value)) < min),
                    })}
                    onClick={() => {
                        if (!default_value.toString().length) return;
                        if (min && formatNumber(String(default_value)) < min) return;
                        onSubmit(formatNumber(String(default_value)));
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

export default Numpad;

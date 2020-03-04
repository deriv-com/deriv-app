import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import Button from 'Components/button/button.jsx';
import NumberGrid from './number-grid.jsx';
import StepInput from './step-input.jsx';

const concatenate = (number, default_value) => default_value.toString().concat(number);

const Numpad = ({
    className,
    currency,
    is_regular,
    is_currency,
    label,
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

    useEffect(() => {
        if (formatted_value !== formatNumber(default_value)) {
            updateValue(value);
            setFloat(isFloat(value));
        }
    }, [value]);

    const updateValue = val => {
        setValue(val);
        if (onValueChange) onValueChange(val);
    };

    const onSelect = num => {
        if (typeof onValidate === 'function' && default_value !== '') {
            const passes = onValidate(concatenate(num, default_value));
            if (!passes) return;
        }

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

    return (
        <div
            className={classNames('dc-numpad', className, {
                'dc-numpad--is-regular': is_regular || is_default_enabled,
                'dc-numpad--is-currency': is_currency && !is_default_enabled,
            })}
        >
            <StepInput
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
                <Button type='secondary' className='dc-numpad__number' has_effect onClick={() => onSelect('.')}>
                    .
                </Button>
            )}
            <div className='dc-numpad__bkspace'>
                <Button
                    type='secondary'
                    has_effect
                    className='dc-numpad__number'
                    onClick={() => onSelect(-1)}
                    is_disabled={!default_value.toString().length}
                >
                    ⌫
                </Button>
            </div>
            <div className='dc-numpad__ok'>
                <Button
                    type='secondary'
                    has_effect
                    className={classNames('dc-numpad__number', {
                        'dc-numpad__number--is-disabled':
                            !default_value.toString().length ||
                            (typeof onValidate === 'function' ? !onValidate(default_value) : false),
                    })}
                    onClick={() => {
                        if (!default_value.toString().length) return;
                        if (typeof onValidate === 'function') {
                            onValidate(formatNumber(default_value));
                            onSubmit(formatNumber(default_value));
                        } else {
                            onSubmit(formatNumber(default_value));
                        }
                    }}
                    is_disabled={!default_value.toString().length}
                >
                    {submit_label}
                </Button>
            </div>
        </div>
    );
};

Numpad.propTypes = {
    currency: PropTypes.string,
    format: PropTypes.func,
    is_currency: PropTypes.bool,
    is_regular: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
    onSubmit: PropTypes.func,
    onValidate: PropTypes.func,
    pip_size: PropTypes.number,
    render: PropTypes.func,
    submit_label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Numpad;

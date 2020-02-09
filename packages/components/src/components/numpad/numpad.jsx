import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Button from 'Components/button/button.jsx';
import NumberGrid from './number-grid.jsx';
import StepInput from './step-input.jsx';

const concatenate = (number, default_value) => default_value.toString().concat(number);

const Numpad = ({
    className,
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
    relative_date,
}) => {
    const [is_float, setFloat] = React.useState(false);
    const [default_value, setValue] = React.useState(value);
    const [relative_date_validation, setRelativeDateValidation] = React.useState(false);
    const isFloat = v => v % 1 !== 0;
    const formatNumber = v => (typeof format === 'function' ? format(v) : v);

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
                    setValue(concatenate(num, '0'));
                } else {
                    setValue(concatenate(num, default_value));
                }

                break;
            default:
                if (default_value === 0) {
                    setValue(concatenate(num, ''));
                } else {
                    const regex = /(?:\d+\.)(\d+)$/;
                    const matches = regex.exec(default_value);

                    if (matches !== null && is_float) {
                        matches.forEach((match, groupIndex) => {
                            const pip_size_allowed = groupIndex === 1 && match.length < pip_size && is_float;
                            if (pip_size_allowed) {
                                setValue(concatenate(num, default_value));
                            }
                        });
                    } else if (concatenate(num, default_value) <= max) {
                        setValue(concatenate(num, default_value));
                    }
                }
        }
    };

    const chop = () => {
        if (default_value.toString().slice(-1) === '.') {
            setFloat(false);
        }
        setValue(default_value.toString().slice(0, -1));
    };

    const is_default_enabled = ![!!is_regular, !!is_currency].includes(true);
    React.useEffect(() => {
        if (is_currency && typeof pip_size === 'undefined') {
            // eslint-disable-next-line no-console
            console.error("Warning: property pip_size is required when using currency type <Numpad pip_size='2' />");
        }
    });
    React.useEffect(() => {
        if (relative_date_validation) setValue(relative_date);
        setRelativeDateValidation(true);
    }, [relative_date]);

    React.useEffect(() => {
        if (onValueChange) onValueChange(default_value);
    }, [default_value]);
    return (
        <div
            className={classNames('dc-numpad', className, {
                'dc-numpad--is-regular': is_regular || is_default_enabled,
                'dc-numpad--is-currency': is_currency && !is_default_enabled,
            })}
        >
            <StepInput
                pip_size={pip_size}
                value={default_value}
                render={render}
                onChange={v => {
                    if (!isFloat(v)) {
                        setFloat(false);
                    }
                    setValue(v);
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
                    className='dc-numpad__number'
                    onClick={() => {
                        onSubmit(formatNumber(default_value));
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
    pip_size: PropTypes.number,
    render: PropTypes.func,
    submit_label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Numpad;

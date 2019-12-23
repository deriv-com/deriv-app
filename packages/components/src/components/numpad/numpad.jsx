import PropTypes  from 'prop-types';
import React      from 'react';
import classNames from 'classnames';
import Button     from 'Components/button';
import StepInput  from './step-input.jsx';

const getFormattedValue = (v, pip = 0) => {
    if (!pip) {
        return Number(v);
    }
    return Number(v).toFixed(pip);
};

const concatenate = ({
    value,
    num,
    onChange,
    max,
    min,
}) => {
    const is_float = Number(value) === value && value % 1 !== 0;
    const is_gt_max = value.toString().concat(num) > max;
    const is_lt_min = value.toString().concat(num) < min;
    let output = min;
    console.log(value.toString().concat(num), max, min, is_gt_max, is_lt_min)
    if (is_gt_max || is_lt_min) {
        console.log('no change')
        output = value;
    } else if (Number(value) === 0 && num !== '.') {
        output = Number(num);
    } else if (!is_float || (is_float && num !== '.')) {
        output = value.toString().concat(num);
    }

    onChange(output);
};

const Numpad = ({
    className,
    is_regular,
    is_currency,
    max = 9999999,
    min = 0,
    pip_size,
    onChange,
    onSubmit,
    value,
}) => {
    const concatNumber = (num) => concatenate({
        value,
        max,
        min,
        num,
        onChange,
    });
    const chop               = () => onChange(getFormattedValue(value.toString().slice(0, -1)));
    const is_default_enabled = ![!!is_regular, !!is_currency].includes(true);
    React.useEffect(() => {
        if (value < min) onChange(min);
        if (value > max) onChange(max);
    });

    if (is_currency && typeof pip_size === 'undefined') {
        // eslint-disable-next-line no-console
        console.error('Warning: property pip_size is required when using currency type <Numpad pip_size=\'2\' />');
    }

    return (
        <div className={
            classNames('dc-numpad', className, {
                'dc-numpad--is-regular' : is_regular || is_default_enabled,
                'dc-numpad--is-currency': is_currency && !is_default_enabled,
            })}
        >
            <StepInput
                pip_size={pip_size}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
            />
            {(Array.from(new Array(9), (val, index) => index)).map(n => {
                const number = n + 1;
                return (
                    <Button
                        type='secondary'
                        className='dc-numpad__number'
                        has_effect
                        key={number}
                        onClick={() => concatNumber(number)}
                    >{number}
                    </Button>
                );
            })}
            <Button
                className='dc-numpad__number dc-numpad__number--zero'
                type='secondary'
                classNameSpan='dc-numpad__number--is-left-aligned'
                has_effect
                onClick={() => concatNumber(0)}
            >
                0
            </Button>
            {is_currency &&
            <Button
                type='secondary'
                className='dc-numpad__number'
                has_effect
                onClick={() => concatNumber('.')}
            >.
            </Button>}
            <div
                className='dc-numpad__bkspace'
            >
                <Button
                    type='secondary'
                    has_effect
                    className='dc-numpad__number'
                    onClick={chop}
                >
                    ⌫
                </Button>
            </div>
            <div
                className='dc-numpad__ok'
            >
                <Button
                    type='secondary'
                    has_effect
                    className='dc-numpad__number'
                    onClick={onSubmit}
                >
                    OK
                </Button>
            </div>
        </div>
    );
};

Numpad.propTypes = {
    currency   : PropTypes.string,
    is_currency: PropTypes.bool,
    is_regular : PropTypes.bool,
    max        : PropTypes.number,
    min        : PropTypes.number,
    onChange   : PropTypes.func,
    onSubmit   : PropTypes.func,
    pip_size   : PropTypes.number,
    value      : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Numpad;

import PropTypes from 'prop-types';
import React     from 'react';
import Input     from 'Components/input';
import Button    from 'Components/button';

const formatNumber = (v, pip_size = 0) => pip_size !== 0 ? v.toFixed(pip_size) : v;

const StepInput = ({
    max,
    min,
    value,
    onChange,
    pip_size = 0,
}) => {
    const is_gt_max = parseFloat(value) + 1 > max;
    const is_lt_min = (parseFloat(value) - 1) < min;

    const increment = () => !is_gt_max ? onChange(parseFloat(value) + 1, pip_size) : undefined;
    const decrement = () => !is_lt_min ? onChange(parseFloat(value) - 1, pip_size) : undefined;

    return (
        <div className='dc-numpad__input-area'>
            <Button
                text='+'
                className='dc-numpad__increment'
                onClick={increment}
            />
            <Input
                className='dc-numpad__input-field'
                name='amount'
                value={value}
                readOnly
            />
            <Button
                text='-'
                className='dc-numpad__decrement'
                onClick={decrement}
            />
        </div>
    );
};

StepInput.propTypes = {
    max     : PropTypes.number,
    min     : PropTypes.number,
    onChange: PropTypes.func,
    value   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default StepInput;


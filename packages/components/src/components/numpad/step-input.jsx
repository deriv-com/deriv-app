import PropTypes from 'prop-types';
import React from 'react';
import Input from 'Components/input/input.jsx';
import Button from 'Components/button/button.jsx';

const StepInput = ({ max, min, value, onChange, render, pip_size = 0 }) => {
    const is_gt_max = parseFloat(value) + 1 > max;
    const is_lt_min = parseFloat(value) - 1 < min;

    const increment = () => {
        if (is_gt_max) return;

        const parsed_value = parseFloat(value);
        const incremented_value = Number.isNaN(parsed_value) ? min : parsed_value + 1;

        onChange(incremented_value, pip_size);
    };

    const decrement = () => {
        if (is_lt_min) return;

        const parsed_value = parseFloat(value);
        const decremented_value = Number.isNaN(parsed_value) ? min : parsed_value - 1;

        onChange(decremented_value, pip_size);
    };

    return (
        <div className='dc-numpad__input-area'>
            <Button text='+' className='dc-numpad__increment' onClick={increment} is_disabled={is_gt_max} />
            <React.Fragment>
                {render &&
                    render({
                        value,
                        className: 'dc-numpad__input-field',
                    })}
            </React.Fragment>
            {!render && <Input className='dc-numpad__input-field' name='amount' value={value} readOnly />}
            <Button text='-' className='dc-numpad__decrement' onClick={decrement} is_disabled={is_lt_min} />
        </div>
    );
};

StepInput.propTypes = {
    max: PropTypes.number,
    min: PropTypes.number,
    onChange: PropTypes.func,
    render: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default StepInput;

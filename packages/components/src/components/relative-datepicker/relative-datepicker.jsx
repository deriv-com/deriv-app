import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { toMoment } from '@deriv/shared/utils/date';

const RelativeDatepicker = ({ onChange, min, max, children }) => {
    const hidden_input_ref = useRef();

    const clickHandler = () => {
        hidden_input_ref.current.click();
    };
    const onChangeHandler = e => {
        onChange(toMoment(e.target.value));
    };

    const inputDateFormat = date => {
        return date
            ? toMoment()
                  .add(date, 'd')
                  .format('YYYY-MM-DD')
            : null;
    };
    return (
        <div className='dc-relative-datepicker' onClick={clickHandler}>
            {children}
            <input
                type='date'
                ref={hidden_input_ref}
                onChange={onChangeHandler}
                min={inputDateFormat(min)}
                max={inputDateFormat(max)}
                className='dc-relative-datepicker__input'
            />
        </div>
    );
};

RelativeDatepicker.propTypes = {
    max: PropTypes.number,
    min: PropTypes.number,
    onChange: PropTypes.func,
};

export default RelativeDatepicker;

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { toMoment, daysFromTodayTo } from '@deriv/shared/utils/date';

const RelativeDatepicker = ({ onChange, min, max, title }) => {
    const hidden_input_ref = useRef();

    const clickHandler = () => {
        hidden_input_ref.current.click();
    };
    const onChangeHandler = e => {
        onChange(daysFromTodayTo(e.target.value));
    };

    const min_date = min
        ? toMoment()
              .add(min, 'd')
              .format('YYYY-MM-DD')
        : null;
    const max_date = max
        ? toMoment()
              .add(max, 'd')
              .format('YYYY-MM-DD')
        : null;
    return (
        <div className='dc-relative-datepicker' onClick={clickHandler}>
            <span className='dc-relative-datepicker__span'>{title}</span>
            <input
                type='date'
                ref={hidden_input_ref}
                onChange={onChangeHandler}
                min={min_date}
                max={max_date}
                className='dc-relative-datepicker__input'
            />
        </div>
    );
};

RelativeDatepicker.propTypes = {
    max: PropTypes.string,
    min: PropTypes.string,
    onChange: PropTypes.func,
    title: PropTypes.string,
};

export default RelativeDatepicker;

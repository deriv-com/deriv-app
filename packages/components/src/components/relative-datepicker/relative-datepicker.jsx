import React from 'react';
import PropTypes from 'prop-types';
import { toMoment, daysFromTodayTo } from '@deriv/shared';
import Text from '../text';

const RelativeDatepicker = ({ onChange, min_date, max_date, title }) => {
    const hidden_input_ref = React.useRef();

    const clickHandler = () => {
        hidden_input_ref.current.click();
    };
    const onChangeHandler = e => {
        onChange(daysFromTodayTo(e.target.value));
    };

    const min_date_moment = toMoment()
        .add(min_date || 0, 'd')
        .format('YYYY-MM-DD');
    const max_date_moment = max_date ? toMoment().add(max_date, 'd').format('YYYY-MM-DD') : null;
    return (
        <div className='dc-relative-datepicker' onClick={clickHandler}>
            <Text
                size='xs'
                line_height='s'
                weight='bold'
                styles={{ color: 'var(--purchase-main-2)' }}
                className='dc-relative-datepicker__span'
            >
                {title}
            </Text>
            <input
                type='date'
                ref={hidden_input_ref}
                onChange={onChangeHandler}
                min={min_date_moment}
                max={max_date_moment}
                className='dc-relative-datepicker__input'
            />
        </div>
    );
};

RelativeDatepicker.propTypes = {
    max_date: PropTypes.string,
    min_date: PropTypes.string,
    onChange: PropTypes.func,
    title: PropTypes.string,
};

export default RelativeDatepicker;

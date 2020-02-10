import React, { useRef } from 'react';
import { toMoment, daysFromTodayTo } from '@deriv/shared/utils/date';

const RelativeDatepicker = props => {
    const hidden_input_ref = useRef();
    const clickHandler = () => {
        hidden_input_ref.current.click();
    };
    const onChangeHandler = e => {
        props.onChange(daysFromTodayTo(e.target.value));
    };

    const min_date = toMoment()
        .add(props.min || 1, 'd')
        .format('YYYY-MM-DD');
    const max_date = props.max
        ? toMoment()
              .add(props.max, 'd')
              .format('YYYY-MM-DD')
        : null;
    return (
        <div id='dc-relative-datepicker'>
            <span onClick={clickHandler}>Pick an end date</span>
            <input
                type='date'
                id='native-calender'
                ref={hidden_input_ref}
                onChange={onChangeHandler}
                min={min_date}
                max={max_date}
            />
        </div>
    );
};
export default RelativeDatepicker;

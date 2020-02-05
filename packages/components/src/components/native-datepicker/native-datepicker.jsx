import React, { useRef } from 'react';
import { toMoment, daysFromTodayTo } from '@deriv/shared/src/utils/date/date-time';

const NativeDatePicker = props => {
    const myRef = useRef();
    const clickHandler = () => {
        myRef.current.click();
    };
    const onChangeHandler = e => {
        props.onChange(daysFromTodayTo(e.target.value));
    };
    const min_date = props.min_date ? toMoment(props.min_date).format('YYYY-MM-DD') : toMoment().format('YYYY-MM-DD');
    const max_date = props.max_date ? toMoment(props.max_date).format('YYYY-MM-DD') : null;
    return (
        <div id='dc-native-datepicker'>
            <span onClick={clickHandler}>Pick an end date</span>
            <input
                type='date'
                id='native-calender'
                ref={myRef}
                onChange={onChangeHandler}
                min={min_date}
                max={max_date}
            />
        </div>
    );
};
export default NativeDatePicker;

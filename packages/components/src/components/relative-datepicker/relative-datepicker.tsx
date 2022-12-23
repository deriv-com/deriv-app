import React from 'react';
import { toMoment, daysFromTodayTo } from '@deriv/shared';
import Text from '../text';

type TRelativeDatepickerProps = {
    max_date?: number | null;
    min_date?: number | null;
    onChange: (days_from_today_to: number) => void;
    title: string;
};

const RelativeDatepicker = ({ onChange, min_date = 0, max_date, title }: TRelativeDatepickerProps) => {
    const hidden_input_ref = React.useRef<HTMLInputElement>(null);

    const clickHandler = () => {
        hidden_input_ref?.current?.click();
    };
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(+(daysFromTodayTo(e.target.value) ?? 0));
    };

    const min_date_moment = toMoment().add(min_date, 'd').format('YYYY-MM-DD');
    const max_date_moment = max_date ? toMoment().add(max_date, 'd').format('YYYY-MM-DD') : '';
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

export default RelativeDatepicker;

import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { toMoment } from '@deriv/shared';
import DatePickerNative from 'Components/date-picker/date-picker-native';
import Wrapper from '../wrapper';

const HasMinMax = () => {
    const [default_value, setDefaultValue] = React.useState(toMoment().format('YYYY-MM-DD'));

    return (
        <Wrapper is_dark={boolean('Dark Theme', false)}>
            <DatePickerNative
                id='date-picker-native'
                display_format='DD MMM YYYY'
                label='Birthday'
                min_date={toMoment().subtract(1, 'days').format('YYYY-MM-DD')}
                max_date={toMoment().add(2, 'days').format('YYYY-MM-DD')}
                onSelect={e => setDefaultValue(e)}
                placeholder='Birthday'
                value={default_value}
            />
        </Wrapper>
    );
};

export default HasMinMax;

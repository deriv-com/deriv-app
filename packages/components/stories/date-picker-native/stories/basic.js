import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { toMoment } from '@deriv/shared';
import DatePickerNative from 'Components/date-picker';
import Wrapper from '../wrapper';

const BasicDelect = () => {
    const [default_value, setDefaultValue] = React.useState(toMoment().format('YYYY-MM-DD'));

    return (
        <Wrapper is_dark={boolean('Dark Theme', false)}>
            <DatePickerNative
                id='date-picker-native'
                display_format='DD MMM YYYY'
                label='Birthday'
                min_date='1970-01-01'
                max_date={toMoment().add(120, 'y').format('YYYY-MM-DD')}
                onSelect={e => setDefaultValue(e)}
                placeholder='Birthday'
                value={default_value}
            />
        </Wrapper>
    );
};

export default BasicDelect;

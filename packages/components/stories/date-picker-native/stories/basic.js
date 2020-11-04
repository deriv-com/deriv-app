import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { toMoment } from '@deriv/shared';
import DatePickerNative from 'Components/date-picker/date-picker-native';
import Wrapper from '../wrapper';

const Basic = () => {
    const [default_value, setDefaultValue] = React.useState(toMoment().format('YYYY-MM-DD'));

    return (
        <Wrapper is_dark={boolean('Dark Theme', false)}>
            <DatePickerNative
                id='date-picker-native'
                display_format='DD MMM YYYY'
                label='Birthday'
                onSelect={e => setDefaultValue(e)}
                placeholder='Birthday'
                value={default_value}
            />
        </Wrapper>
    );
};

export default Basic;

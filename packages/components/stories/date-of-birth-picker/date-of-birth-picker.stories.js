import { storiesOf } from '@storybook/react';
import DateOfBirthPicker from 'Components/date-of-birth-picker';
import { toMoment } from '@deriv/shared';
import React from 'react';
import notes from './README.md';
import './date-of-birth-picker.stories.scss';

storiesOf('DateOfBirthPicker', module).add(
    'Main function',
    () => {
        return (
            <React.Fragment>
                <div className={'date-of-birth-picker__wrapper'}>
                    <DateOfBirthPicker
                        name='date_of_birth'
                        label={'Date of birth*'}
                        onChange={({ target }) => console.log(toMoment(target.value).format('YYYY-MM-DD'))}
                    />
                </div>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);

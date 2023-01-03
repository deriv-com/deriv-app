import { storiesOf } from '@storybook/react';
import notes from './README.md';
import React from 'react';
import RelativeDatepicker from 'Components/relative-datepicker';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import Wrapper from '../shared/wrapper';

const stories = storiesOf('Relative-DatePicker', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add(
    'Basic usage',
    () => {
        return (
            <Wrapper is_dark={boolean('dark_theme', false)}>
                <div className='relative-datepicker-component'>
                    <RelativeDatepicker onChange={action('changed')} min_date={0} max_date={5} title={'Pick a date'} />
                </div>
            </Wrapper>
        );
    },
    {
        notes,
    }
);

import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import { toMoment } from '@deriv/shared/utils/date';
import Calendar from 'Components/calendar';
import Theme from '../shared/theme';

const stories = storiesOf('Calendar', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories
    .add('basic', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <Calendar />
        </Theme>
    ))
    .add('with Today button', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <Calendar has_today_btn />
        </Theme>
    ))
    .add('with footer', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <Calendar footer='This is a footer' />
        </Theme>
    ))
    .add('with min. date', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <Calendar min_date={toMoment()} />
        </Theme>
    ))
    .add('with max. date', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <Calendar max_date={toMoment().add(1, 'month')} />
        </Theme>
    ))
    .add('disable weekends', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <Calendar max_date={toMoment().add(1, 'month')} disabled_days={[6, 0]} />
        </Theme>
    ))
    .add('events', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <Calendar
                max_date={toMoment().add(1, 'month')}
                holidays={[
                    {
                        dates: ['2020-04-01', '2020-04-02'],
                        descrip: "Oh, it's Christmas!",
                    },
                    {
                        dates: ['Fridays'],
                        descrip: 'Closes early (at 20:55)',
                    },
                ]}
            />
        </Theme>
    ));

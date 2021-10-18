import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import { toMoment } from '@deriv/shared';
import Calendar from 'Components/calendar';
import Theme from '../shared/theme';
import notes from './README.md';

const stories = storiesOf('Calendar', module);

const FlexWrapper = ({ children, justifyContent = 'center' }) => (
    <div
        style={{
            display: 'flex',
            padding: '36px',
            justifyContent,
        }}
    >
        {children}
    </div>
);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories
    .add(
        'basic',
        () => (
            <Theme is_dark={boolean('dark theme', false)}>
                <FlexWrapper>
                    <Calendar />
                </FlexWrapper>
            </Theme>
        ),
        {
            notes,
        }
    )
    .add(
        'show Today button',
        () => (
            <Theme is_dark={boolean('dark theme', false)}>
                <FlexWrapper>
                    <Calendar has_today_btn />
                </FlexWrapper>
            </Theme>
        ),
        {
            notes,
        }
    )
    .add(
        'footer',
        () => (
            <Theme is_dark={boolean('dark theme', false)}>
                <FlexWrapper>
                    <Calendar footer='This is a footer' />
                </FlexWrapper>
            </Theme>
        ),
        {
            notes,
        }
    )
    .add(
        'minimum date',
        () => (
            <Theme is_dark={boolean('dark theme', false)}>
                <FlexWrapper>
                    <Calendar min_date={toMoment()} />
                </FlexWrapper>
            </Theme>
        ),
        {
            notes,
        }
    )
    .add(
        'maximum date',
        () => (
            <Theme is_dark={boolean('dark theme', false)}>
                <FlexWrapper>
                    <Calendar max_date={toMoment().add(1, 'month')} />
                </FlexWrapper>
            </Theme>
        ),
        {
            notes,
        }
    )
    .add(
        'disable days of the week',
        () => (
            <Theme is_dark={boolean('dark theme', false)}>
                <FlexWrapper>
                    <Calendar max_date={toMoment().add(1, 'month')} disabled_days={[6, 0]} />
                </FlexWrapper>
            </Theme>
        ),
        {
            notes,
        }
    )
    .add(
        'events',
        () => (
            <Theme is_dark={boolean('dark theme', false)}>
                <FlexWrapper>
                    <Calendar
                        max_date={toMoment().add(1, 'month')}
                        events={[
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
                </FlexWrapper>
            </Theme>
        ),
        {
            notes,
        }
    );

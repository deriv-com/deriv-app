import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React, { useState } from 'react';
import { toMoment } from '@deriv/shared/utils/date';
import DatePicker from 'Components/date-picker';
import Theme from '../shared/theme';

const stories = storiesOf('DatePicker', module);

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
    .add('basic', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePicker />
            </FlexWrapper>
        </Theme>
    ))
    .add('label', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePicker label='DatePicker Label' />
            </FlexWrapper>
        </Theme>
    ))
    .add('alignment', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePicker label='Left align' alignment='left' />
            </FlexWrapper>
        </Theme>
    ))
    .add('display format', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper justifyContent='space-between'>
                <DatePicker label='Default' />
                <DatePicker label='DD-MM-YYY' display_format='DD-MM-YYYY' />
                <DatePicker label='DD/MM/YYYY' display_format='DD/MM/YYYY' />
                <DatePicker label='DD MMM YYYY' display_format='DD MMM YYYY' />
            </FlexWrapper>
        </Theme>
    ))
    .add('leading icon', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePicker show_leading_icon />
            </FlexWrapper>
        </Theme>
    ))
    .add('is clearable', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePicker is_clearable />
            </FlexWrapper>
        </Theme>
    ))
    .add('placeholder', () => {
        return (
            <Theme is_dark={boolean('Theme', false)}>
                <FlexWrapper>
                    <DatePicker placeholder='I am placeholder' />
                </FlexWrapper>
            </Theme>
        );
    })
    .add('footer', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePicker footer='Abracadabra!' has_today_btn />
            </FlexWrapper>
        </Theme>
    ))
    .add('mode', () => {
        const [footer, setFooterText] = useState('');

        const onChange = e => {
            setFooterText(`Duration: ${e.duration} ${e.duration === 1 ? 'day' : 'days'}`);
        };

        return (
            <Theme is_dark={boolean('Theme', false)}>
                <FlexWrapper justifyContent='space-around'>
                    <DatePicker label='Default' min_date={toMoment()} onChange={onChange} has_today_btn />
                    <DatePicker
                        label='Duration DatePicker'
                        footer={footer}
                        mode='duration'
                        min_date={toMoment()}
                        onChange={onChange}
                        has_range_selection
                    />
                </FlexWrapper>
            </Theme>
        );
    });

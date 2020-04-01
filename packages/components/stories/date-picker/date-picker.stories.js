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

const DatePickerWrapper = ({ children }) => (
    <div
        style={{
            margin: '0 4px',
            width: '280px',
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
                <DatePickerWrapper>
                    <DatePicker />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('label', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker label='DatePicker Label' />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('alignment', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker label='Left align' alignment='left' />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('display format', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker label='Default' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker label='DD-MM-YYY' display_format='DD-MM-YYYY' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker label='DD/MM/YYYY' display_format='DD/MM/YYYY' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker label='DD MMM YYYY' display_format='DD MMM YYYY' />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('leading icon', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker show_leading_icon />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('is clearable', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker is_clearable />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('placeholder', () => {
        return (
            <Theme is_dark={boolean('Theme', false)}>
                <FlexWrapper>
                    <DatePickerWrapper>
                        <DatePicker placeholder='I am placeholder' />
                    </DatePickerWrapper>
                </FlexWrapper>
            </Theme>
        );
    })
    .add('footer', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker footer='Abracadabra!' has_today_btn />
                </DatePickerWrapper>
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
                <FlexWrapper>
                    <DatePickerWrapper>
                        <DatePicker label='Default' min_date={toMoment()} onChange={onChange} has_today_btn />
                    </DatePickerWrapper>
                    <DatePickerWrapper>
                        <DatePicker
                            label='Duration DatePicker'
                            footer={footer}
                            mode='duration'
                            min_date={toMoment()}
                            onChange={onChange}
                            has_range_selection
                        />
                    </DatePickerWrapper>
                </FlexWrapper>
            </Theme>
        );
    })
    .add('value', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker value='2000-01-04' has_today_btn />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ))
    .add('view', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePickerWrapper>
                    <DatePicker label='Default' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker label='Month' calendar_view='month' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker label='Year' calendar_view='year' />
                </DatePickerWrapper>
                <DatePickerWrapper>
                    <DatePicker label='Decade' calendar_view='decade' />
                </DatePickerWrapper>
            </FlexWrapper>
        </Theme>
    ));

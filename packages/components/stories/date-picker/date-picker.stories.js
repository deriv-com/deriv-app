import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React, { useState } from 'react';
import { toMoment } from '@deriv/shared/utils/date';
import DatePicker from 'Components/date-picker';
import { Text } from '../button/shared-style';
import Theme from '../shared/theme';

const stories = storiesOf('DatePicker', module);

const FlexWrapper = ({ children }) => (
    <div
        style={{
            display: 'grid',
            gridGap: '24px',
            justifyContent: 'center',
            padding: '16px',
            height: '50vh',
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
    .add('alignment', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <div>
                    <Text size='1.6rem'>default</Text>
                    <DatePicker />
                </div>

                <div>
                    <Text size='1.6rem'>left</Text>
                    <DatePicker alignment='left' />
                </div>
            </FlexWrapper>
        </Theme>
    ))
    .add('display format', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePicker />
                <DatePicker display_format='DD-MM-YYYY' />
                <DatePicker display_format='DD/MM/YYYY' />
                <DatePicker display_format='DD MMM YYYY' />
            </FlexWrapper>
        </Theme>
    ))
    .add('show leading icon', () => (
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
    .add('with placeholder', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <DatePicker placeholder='I am placeholder' value='' />
            </FlexWrapper>
        </Theme>
    ))
    .add('with footer', () => (
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
                <FlexWrapper>
                    <div>
                        <Text size='1.6rem'>default</Text>
                        <DatePicker
                            leading_icon
                            min_date={toMoment()}
                            onChange={onChange}
                            has_today_btn
                            has_range_selection
                        />
                    </div>
                    <div>
                        <Text size='1.6rem'>duration</Text>
                        <DatePicker
                            footer={footer}
                            leading_icon
                            mode='duration'
                            min_date={toMoment()}
                            onChange={onChange}
                            has_range_selection
                        />
                    </div>
                </FlexWrapper>
            </Theme>
        );
    });

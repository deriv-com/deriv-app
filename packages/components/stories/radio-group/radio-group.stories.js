import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import RadioGroup from 'Components/radio-group';
import Wrapper from '../shared/wrapper';
import notes from './README.md';

const stories = storiesOf('Radio Group', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add(
    'Basic usage',
    () => {
        const radio_items = [
            {
                value: '1',
                label: 'Radio 1',
            },
            {
                value: '2',
                label: 'Radio 2',
            },
            {
                value: '3',
                label: 'Radio 3',
            },
            {
                value: '4',
                label: 'Radio 4',
            },
        ];

        return (
            <Wrapper is_dark={boolean('dark theme', false)}>
                <div className='radio-group-component'>
                    <RadioGroup name='testRadio' onToggle={action('changed')}>
                        {radio_items.map(item => (
                            <RadioGroup.Item
                                key={item.value}
                                label={item.label}
                                value={item.value}
                                disabled={boolean('disabled', false)}
                            />
                        ))}
                    </RadioGroup>
                </div>
            </Wrapper>
        );
    },
    { notes }
);

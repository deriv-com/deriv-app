import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Wrapper from '../shared/wrapper';
import Money from 'Components/money';
import React from 'react';
import notes from './README.md';

storiesOf('Money', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <Money amount={1423602.2} currency={'USD'} should_format show_currency />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );

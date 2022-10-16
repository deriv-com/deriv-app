import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Wrapper from '../shared/wrapper';
import Counter from 'Components/counter';
import React from 'react';
import notes from './README.md';

storiesOf('Counter', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <Counter count={5} className='counter' />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );

import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Wrapper from '../shared/wrapper';
import Checkbox from 'Components/checkbox';
import React, { useState } from 'react';
import notes from './README.md';

storiesOf('CheckBox', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [selected, setSelected] = useState(false);

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <Checkbox
                        name='test_checkbox'
                        value={selected}
                        onChange={() => setSelected(!selected)}
                        label='This is a test checkbox'
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );

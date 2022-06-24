import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Wrapper from '../shared/wrapper.jsx';
import Checklist from 'Components/checklist';
import React from 'react';
import notes from './README.md';

storiesOf('CheckList', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const list = [
                {
                    content: 'Item with an action',
                    status: 'action',
                },
                {
                    content: 'Item with done status ',
                    status: 'done',
                },
                {
                    content: 'Item with an action button',
                    status: 'button-action',
                    button_text: 'I accept',
                },
                {
                    content: 'Item with an action',
                    status: 'action',
                },
            ];
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <Checklist items={list} />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );

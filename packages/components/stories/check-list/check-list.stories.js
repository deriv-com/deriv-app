import { storiesOf } from '@storybook/react';
import Checklist from 'Components/checklist';
import React from 'react';
import notes from './README.md';
import './check-list.stories.scss';

storiesOf('CheckList', module).add(
    'Main function',
    () => {
        const list = [
            {
                content: 'Item with an action',
                status: 'action',
                onClick: () => console.log('clicked'),
            },
            {
                content: 'Item with done status ',
                status: 'done',
                onClick: () => console.log('clicked'),
            },
            {
                content: 'Item with an action button',
                status: 'button-action',
                onClick: () => console.log('clicked'),
                button_text: 'I accept',
            },
            {
                content: 'Item with an action',
                status: 'action',
                onClick: () => console.log('clicked'),
            },
        ];
        return (
            <React.Fragment>
                <div className={'checklist__wrapper'}>
                    <Checklist items={list} />
                </div>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);

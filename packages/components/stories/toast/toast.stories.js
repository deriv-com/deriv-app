import { storiesOf } from '@storybook/react';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import Toast from 'Components/toast';
import Theme from '../shared/theme';
import notes from './README.md';

const stories = storiesOf('Toast', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories
    .add(
        'static',
        () => (
            <Theme is_dark={boolean('dark theme', false)}>
                <Toast onClick={action('clicked')}>Message to be shown!</Toast>
            </Theme>
        ),
        { notes }
    )
    .add(
        'with timeout',
        () => (
            <Theme is_dark={boolean('dark theme', false)}>
                <Toast
                    onClick={action('clicked')}
                    is_open={boolean('is open?', true)}
                    timeout={number('Timeout', 3000)}
                    onClose={() => {
                        /* eslint-disable no-console */
                        console.log('Closed');
                    }}
                >
                    Message
                </Toast>
            </Theme>
        ),
        { notes }
    );

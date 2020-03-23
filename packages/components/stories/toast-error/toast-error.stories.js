import { storiesOf } from '@storybook/react';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import ToastError from 'Components/toast-error';
import Theme from '../shared/theme';

const stories = storiesOf('ToastError', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories
    .add('static', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <ToastError>Message to be shown!</ToastError>
        </Theme>
    ))
    .add('with timeout', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <ToastError
                is_open={boolean('is open?', true)}
                timeout={number('Timeout', 3000)}
                onClose={console.log('Closed')}
            >
                Message
            </ToastError>
        </Theme>
    ));

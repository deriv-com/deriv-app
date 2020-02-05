import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import NativeDatePicker from 'Components/native-datepicker';
import { action } from '@storybook/addon-actions';
import Theme from '../shared/theme';

const stories = storiesOf('Native datepicker', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('basic usage', () => (
    <Theme is_dark={boolean('Theme', true)}>
        <NativeDatePicker onChange={action(date => date)} />
    </Theme>
));

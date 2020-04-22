import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { toMoment } from '@deriv/shared/src/utils/date/date-time';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import RelativeDatepicker from 'Components/relative-datepicker';
import { action } from '@storybook/addon-actions';
import Theme from '../shared/theme';

const stories = storiesOf('Relative datepicker', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('basic usage', () => (
    <Theme is_dark={boolean('Theme', true)}>
        <RelativeDatepicker onChange={action(date => date)} min_date={toMoment()} title='Pick an end date' />
    </Theme>
));

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import BasicDatePicker from './stories/basic';
import notes from './README.md';

const stories = storiesOf('DatePickerNative', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('Basic usage', BasicDatePicker, { notes });

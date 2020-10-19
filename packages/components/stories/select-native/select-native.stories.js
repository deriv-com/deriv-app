import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import BasicSelect from './stories/basic';
import NoEmptySelect from './stories/no-empty';
import WithHelperSelect from './stories/with-helper';
import HasErrorSelect from './stories/has-error';
import DisabledSelect from './stories/disabled';
import notes from './README.md';

const stories = storiesOf('SelectNative', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories
    .add('Basic usage', BasicSelect, { notes })
    .add('No empty option', NoEmptySelect, { notes })
    .add('With helper text', WithHelperSelect, { notes })
    .add('Has Error', HasErrorSelect, { notes })
    .add('Disabled', DisabledSelect, { notes });

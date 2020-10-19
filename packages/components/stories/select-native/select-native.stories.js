import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import BasicSelect from './stories/basic';
import NoEmptySelect from './stories/no-empty';
import WithHelperSelect from './stories/with-helper';
import HasErrorSelect from './stories/has-error';
import DisabledSelect from './stories/disabled';

const stories = storiesOf('SelectNative', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

export const notes = `
    This is a basic example of the native dropdown component.

    The native dropdown component is a fluid element, and it fills it's parent workspace.

    We use this component on mobile to have a native select. 
`;

stories
    .add('Basic usage', BasicSelect, { notes })
    .add('No empty option', NoEmptySelect, { notes })
    .add('With helper text', WithHelperSelect, { notes })
    .add('Has Error', HasErrorSelect, { notes })
    .add('Disabled', DisabledSelect, { notes });

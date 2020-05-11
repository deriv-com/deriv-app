import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import RadioGroup from 'Components/radio-group';
import Theme from '../shared/theme';

const stories = storiesOf('Radio Group', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('basic usage', () => (
    <Theme is_dark={boolean('Theme', false)}>
        <div style={{ display: 'flex' }}>
            <RadioGroup items={[{ label: 'test1', value: 'test1' }, { label: 'test2', value: 'test2' }]}>
                {/* <RadioGroup.Item label='test1' value='test1'></RadioGroup.Item>
                <RadioGroup.Item label='test1' value='test1'></RadioGroup.Item> */}
            </RadioGroup>
        </div>
    </Theme>
));

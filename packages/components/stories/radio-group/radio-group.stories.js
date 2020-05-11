import { withInfo } from '@storybook/addon-info';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import RadioGroup from 'Components/radio-group';
import React from 'react';
import Theme from '../shared/theme';

const stories = storiesOf('Radio Group', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('basic usage', () => (
    <Theme is_dark={boolean('Theme', false)}>
        <div style={{ display: 'flex' }}>
            <RadioGroup
                items={[
                    { id: 'test1', label: 'test1', value: 'test1' },
                    { id: 'test2', label: 'test2', value: 'test2' },
                ]}
                name='salutation'
                onToggle={e => {
                    e.persist();
                }}
            ></RadioGroup>
        </div>
    </Theme>
));

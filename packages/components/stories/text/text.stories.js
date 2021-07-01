import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Text from 'Components/text';
import Theme from '../shared/theme';
import notes from './README.md';

const stories = storiesOf('Text', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add(
    'basic usage',
    () => (
        <Theme is_dark={boolean('Theme', false)}>
            <div>
                <Text size='s' align='right' weight='bold'>
                    Test Text Components
                </Text>
                {/* Adding Paragraph */}
                <Text as='p' size='m' align='center' weight='bold' color='profit-success'>
                    Test Paragraph Components
                </Text>
                {/* Adding Header */}
                <Text as='h1' size='l' align='left' weight='bold' color='loss-danger'>
                    Test Header Components
                </Text>
            </div>
        </Theme>
    ),
    { notes }
);

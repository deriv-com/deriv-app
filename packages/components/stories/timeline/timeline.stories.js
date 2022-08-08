import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Timeline from 'Components/timeline';
import Wrapper from '../shared/theme';
import notes from './README.md';

const stories = storiesOf('Timeline', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add(
    'Basic usage',
    () => (
        <Wrapper is_dark={boolean('dark theme', true)}>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '20rem' }} />
                <Timeline>
                    <Timeline.Item item_title='Title'>
                        <div>test</div>
                    </Timeline.Item>
                    <Timeline.Item item_title='Title2'>
                        <div>test2</div>
                    </Timeline.Item>
                    <Timeline.Item item_title='Title3'>
                        <div>test3</div>
                    </Timeline.Item>
                </Timeline>
            </div>
        </Wrapper>
    ),
    {
        notes,
    }
);

import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Timeline from 'Components/timeline';
import Theme from '../shared/theme';

const stories = storiesOf('Timeline', module);

const Item = <div></div>;
stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('basic usage', () => (
    <Theme is_dark={boolean('Theme', true)}>
        <div style={{ display: 'flex' }}>
            <div>left component</div>
            <Timeline>
                <Timeline.Item title='Title'>
                    <div>test</div>
                </Timeline.Item>
                <Timeline.Item title='Title2'>
                    <div>test2</div>
                </Timeline.Item>
                <Timeline.Item title='Title3'>
                    <div>test3</div>
                </Timeline.Item>
                {/* <div
                    style={{ borderRadius: '4px', border: 'solid 1px #323738' }}
                    title='Select tokens based on the access you need.'
                >
                    View account activity such as settings, limits, balance sheets, trade purchase history, and more.{' '}
                </div>

                <div
                    style={{ borderRadius: '4px', border: 'solid 1px #323738', height: '88px' }}
                    title='Name your token and click on Create to generate your token.'
                >
                    Withdraw to payment agents, transfer funds between accounts, and set/clear cashier passwords.{' '}
                </div>
                <div
                    style={{ borderRadius: '4px', border: 'solid 1px #323738', height: '88px' }}
                    title='Copy and paste the token into the app.'
                >
                    Open accounts, manage settings, manage token usage, and more.{' '}
                </div> */}
            </Timeline>
        </div>
    </Theme>
));

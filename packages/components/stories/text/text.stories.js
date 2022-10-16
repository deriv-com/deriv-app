import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs, text, select } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Text from 'Components/text';
import Theme from '../shared/theme';
import notes from './README.md';
import './styles.scss';

const stories = storiesOf('Text', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add(
    'Basic usage',
    () => (
        <Theme is_dark={boolean('dark theme', false)}>
            <div className='text-component-container'>
                <Text
                    align='right'
                    weight={select('weight', ['lighter', 'normal', 'bold', 'bolder'], 'bold')}
                    color={select(
                        'color',
                        [
                            'general',
                            'less-prominent',
                            'prominent',
                            'disabled',
                            'loss-danger',
                            'profit-success',
                            'warning',
                            'red',
                            'blue',
                        ],
                        'general'
                    )}
                    size={select('size', ['xxxxs', 'xxxs', 'xxs', 'xs', 's', 'xsm', 'sm', 'm', 'l', 'xl', 'xxl'], 's')}
                    line_height={select('line height', ['xxs', 's', 'm', 'l', 'xl', 'xxl'], 'm')}
                >
                    {text('text', 'Hello World')}
                </Text>
            </div>
        </Theme>
    ),
    { notes }
);

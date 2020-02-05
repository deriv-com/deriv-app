import React from 'react';
import { storiesOf } from '@storybook/react';
import CircularProgress from '../../src/components/circular-progress/index';
import Theme from '../shared/theme';

const progresses = [
    {
        is_clockwise: true,
        is_dark: false,
        value: 75,
    },
    {
        is_clockwise: true,
        is_dark: false,
        value: 25,
    },
    {
        is_clockwise: true,
        is_dark: true,
        value: 75,
    },
    {
        is_clockwise: true,
        is_dark: true,
        value: 25,
    },
];

storiesOf('Circular Progress', module).add('Basic usage', () => (
    <div
        style={{
            display: 'grid',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gridGap: '10px',
            paddingTop: '10px',
        }}
    >
        {progresses.map((item, index) => {
            return (
                <Theme is_dark={item.is_dark} key={index}>
                    <CircularProgress progress={item.value} />
                </Theme>
            );
        })}
    </div>
));

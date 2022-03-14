import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import ProgressBar from '../../../src/components/progress-bar/index';
import Wrapper from '../../shared/wrapper';

const Basic = () => {
    const progress_bars = [
        {
            value: 0.2,
            label: `Danger`,
        },
        {
            value: 0.5,
            label: 'Warning',
        },
        {
            value: 0.8,
            label: 'Success',
        },
    ];

    return (
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
            {progress_bars.map((item, index) => {
                return (
                    <Wrapper className='progress-bar-storybook' is_dark={boolean('Dark Theme', false)} key={index}>
                        <ProgressBar value={item.value} label={item.label} />
                    </Wrapper>
                );
            })}
        </div>
    );
};

export default Basic;

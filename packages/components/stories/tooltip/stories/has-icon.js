import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import Tooltip from 'Components/tooltip';
import Wrapper from '../../shared/wrapper';

const Basic = () => (
    <React.Fragment>
        <Wrapper is_dark={boolean('Dark Theme', false)}>
            <Tooltip
                className='tooltip-storybook-wrapper'
                classNameIcon='tooltip-storybook-icon'
                alignment='right'
                message='Information about item.'
                icon='info'
            >
                <span>Hover me to see tooltip.</span>
            </Tooltip>
        </Wrapper>
        <Wrapper is_dark={boolean('Dark Theme', false)}>
            <Tooltip
                className='tooltip-storybook-wrapper'
                classNameIcon='tooltip-storybook-icon'
                alignment='right'
                message='Information about item.'
                icon='question'
            >
                <span>Hover me to see tooltip.</span>
            </Tooltip>
        </Wrapper>
    </React.Fragment>
);

export default Basic;

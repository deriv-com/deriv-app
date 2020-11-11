import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import Tooltip from 'Components/tooltip';
import Wrapper from '../../shared/wrapper';

const Basic = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <Tooltip
            className='tooltip-storybook-wrapper'
            classNameIcon='tooltip-storybook-icon'
            alignment='right'
            message='Information about the item.'
        >
            <span>Hover me to see a tooltip.</span>
        </Tooltip>
    </Wrapper>
);

export default Basic;

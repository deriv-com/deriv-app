import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import Tooltip from 'Components/tooltip';
import Wrapper from '../../shared/wrapper';

const HasError = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <Tooltip
            className='tooltip-storybook-wrapper'
            classNameIcon='tooltip-storybook-icon'
            alignment='right'
            message='Information about item.'
            has_error={true}
        >
            <span>Hover me to see tooltip.</span>
        </Tooltip>
    </Wrapper>
);

export default HasError;

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
            message='Information about the item.'
            has_error={true}
        >
            <span>Hover me to see a tooltip.</span>
        </Tooltip>
    </Wrapper>
);

export default HasError;

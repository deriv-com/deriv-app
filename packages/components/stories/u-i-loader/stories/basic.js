import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import UILoader from 'Components/u-i-loader';
import Wrapper from '../../shared/wrapper';

const Basic = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <UILoader />
    </Wrapper>
);

export default Basic;

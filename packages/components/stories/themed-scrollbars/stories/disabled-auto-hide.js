import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import ThemedScrollbars from 'Components/themed-scrollbars';
import Wrapper from '../../shared/wrapper';
import text from '../text';

const DisabledAutoHide = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <ThemedScrollbars height={300} autohide={false}>
            <p>{text.repeat(30)}</p>
        </ThemedScrollbars>
    </Wrapper>
);

export default DisabledAutoHide;

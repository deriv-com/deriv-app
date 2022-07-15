import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import ThemedScrollbars from 'Components/themed-scrollbars';
import Wrapper from '../../shared/wrapper';
import text from '../text';

const DisabledCustomScrollbar = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <ThemedScrollbars height={300} is_bypassed={true}>
            <p>{text.repeat(30)}</p>
        </ThemedScrollbars>
    </Wrapper>
);

export default DisabledCustomScrollbar;

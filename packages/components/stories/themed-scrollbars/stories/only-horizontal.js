import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import ThemedScrollbars from 'Components/themed-scrollbars';
import Wrapper from '../../shared/wrapper';
import text from '../text';

const OnlyHorizontal = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <ThemedScrollbars width={300} is_only_horizontal={true}>
            <p style={{ width: '800px' }}>{text.repeat(30)}</p>
        </ThemedScrollbars>
    </Wrapper>
);

export default OnlyHorizontal;

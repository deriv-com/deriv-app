import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import ThemedScrollbars from 'Components/themed-scrollbars';
import Wrapper from '../../shared/wrapper';
import text from '../text';

const HasHorizontal = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <ThemedScrollbars height={300} width={300} has_horizontal={true}>
            <p style={{ width: '600px' }}>{text.repeat(30)}</p>
        </ThemedScrollbars>
    </Wrapper>
);

export default HasHorizontal;

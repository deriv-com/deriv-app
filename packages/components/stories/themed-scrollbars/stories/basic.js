import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import ThemedScrollbars from 'Components/themed-scrollbars';
import Wrapper from '../../shared/wrapper';
import text from '../text';

const Basic = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <ThemedScrollbars onScroll={action('scrolling')} height={300}>
            <p>{text.repeat(30)}</p>
        </ThemedScrollbars>
    </Wrapper>
);

export default Basic;

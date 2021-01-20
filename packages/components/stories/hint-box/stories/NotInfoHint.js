import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import Wrapper from '../../shared/wrapper';
import HintBox from 'Components/hint-box';

const NotInfoHint = () => {
    return (
        <Wrapper is_dark={boolean('Dark Theme', false)}>
            <HintBox icon={'IcCheckmarkOutline'} message={'This is a hint message'} />
        </Wrapper>
    );
};

export default NotInfoHint;

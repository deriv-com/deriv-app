import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import Wrapper from '../../shared/wrapper';
import HintBox from 'Components/hint-box';

const InfoHint = () => {
    return (
        <Wrapper is_dark={boolean('Dark Theme', false)}>
            <HintBox icon={'IcAlertInfo'} is_info message={'This is an info hint message'} />
        </Wrapper>
    );
};

export default InfoHint;

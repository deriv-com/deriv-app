import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import MultiStep from 'Components/multi-step';
import Wrapper from '../../shared/wrapper';

const Basic = () => {
    const slides_count = [...Array(3).keys()];

    return (
        <Wrapper is_full_width is_block is_dark={boolean('Dark Theme', false)}>
            <MultiStep
                lbl_previous='Back'
                steps={[{ component: 'Step 1' }, { component: 'Step 2' }, { component: 'Step 3' }]}
            />
        </Wrapper>
    );
};

export default Basic;

import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import Button from 'Components/button';
import MultiStep from 'Components/multi-step';
import Wrapper from '../../shared/wrapper';

const steps = [
    { component: <span>{'Step 1'}</span> },
    { component: <span>{'Step 2'}</span> },
    { component: <span>{'Step 3'}</span> },
];

const Basic = () => {
    const multi_step_ref = React.createRef();
    const onClick = () => {
        if (multi_step_ref.current && multi_step_ref.current?.state.step < steps.length - 1) {
            multi_step_ref.current.nextStep();
        }
    };

    return (
        <Wrapper is_block className='multi-step-storybook' is_dark={boolean('Dark Theme', false)}>
            <MultiStep ref={multi_step_ref} lbl_previous='Back' steps={steps} />
            <Button onClick={onClick} text='Next step' medium />
        </Wrapper>
    );
};

export default Basic;

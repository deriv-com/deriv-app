import React from 'react';
import DesktopWrapper from '../desktop-wrapper';
import MobileWrapper from '../mobile-wrapper';
import Stepper, { TStep } from './stepper';
import StepConnectorLine from './step-connector-line';

type TFormProgressProps = {
    steps: Array<TStep>;
};

/**
 * @name FormProgress
 * @param steps - List of steps to be rendered
 * @returns React Component
 */

const FormProgress = ({ steps = [] }: TFormProgressProps) => {
    const [active_step, setActiveStep] = React.useState(0);

    const updateStep = (index: number) => {
        if (steps[index - 1]?.is_filled || index === 0) {
            setActiveStep(index);
        }
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                {steps.map((step, idx) => (
                    <Stepper
                        key={idx}
                        step={step}
                        step_count={idx}
                        is_active={idx <= active_step}
                        onClick={() => updateStep(idx)}
                    />
                ))}
            </DesktopWrapper>
            <MobileWrapper>
                <div className='stepper__layout'>
                    {steps.map((_, idx) => (
                        <StepConnectorLine is_active={idx <= active_step} key={idx} />
                    ))}
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default FormProgress;

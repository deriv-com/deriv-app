import classNames from 'classnames';
import React from 'react';
import Icon from '../icon';

type MultiStepProps = {
    className: string;
    lbl_previous: string;
    steps: unknown;
};

const MultiStep = React.forwardRef(({ className, lbl_previous, steps }: MultiStepProps, ref) => {
    const [step, setStep] = React.useState(0);
    const [component, setComponent] = React.useState(steps[0].component);

    React.useEffect(() => {
        setComponent(steps[step].component);
    }, [step, steps]);

    React.useImperativeHandle(ref, () => ({
        goNextStep,
        goPrevStep,
    }));

    const goNextStep = () => setStep(step + 1);
    const goPrevStep = () => setStep(step - 1);

    const prev_btn = (
        <div className='multi-step__header'>
            <a onClick={goPrevStep} className='multi-step__btn'>
                <Icon icon='IcArrowLeftBold' className='multi-step__btn-icon' />
                {lbl_previous}
            </a>
        </div>
    );

    return (
        <div className={classNames('multi-step', className)}>
            {step !== 0 && lbl_previous && prev_btn}
            <div className='multi-step__component'>{component}</div>
        </div>
    );
});

MultiStep.displayName = 'MultiStep';

export default MultiStep;

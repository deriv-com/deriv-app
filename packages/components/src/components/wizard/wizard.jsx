import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Step from './wizard-step.jsx';
import Icon from '../icon';
import FormProgress from '../form-progress';
import DesktopWrapper from '../desktop-wrapper';
import MobileWrapper from '../mobile-wrapper';

const Wizard = React.forwardRef(
    ({ steps, lbl_previous, has_prev, lbl_next, has_next, has_form_progress, className }, ref) => {
        const [step, setStep] = React.useState(0);
        const [lastStep] = React.useState(steps.length - 1);
        const [component, setComponent] = React.useState(steps[0].component);

        const nextStep = () => {
            if (step + 1 > lastStep) return;
            const newStep = step + 1;
            setStep(newStep);
            setComponent(steps[newStep].component);
        };

        const prevStep = () => {
            if (step - 1 < 0) return;
            const newStep = step - 1;
            setStep(newStep);
            setComponent(steps[newStep].component);
        };

        const selectStep = selectedStep => {
            if (selectedStep < 0 || selectedStep > lastStep) return;
            setStep(selectedStep);
            setComponent(steps[selectedStep].component);
        };

        React.useImperativeHandle(ref, () => ({
            nextStep,
            selectStep,
        }));

        const prevButton = () =>
            step !== 0 ? (
                <a onClick={prevStep} className='wizard__btn wizard__btn-left'>
                    <Icon icon='IcArrowLeftBold' className='wizard__btn-icon-left' />
                    {lbl_previous}
                </a>
            ) : (
                <div className='wizard__placeholder' />
            );

        const nextButton = () =>
            step !== lastStep ? (
                <a onClick={nextStep} className='wizard__btn wizard__btn-right'>
                    {lbl_next}
                    <Icon icon='IcArrowRightBold' className='wizard__btn-icon-right' />
                </a>
            ) : (
                <div className='wizard__placeholder' />
            );

        return (
            <div className={classNames('wizard', className)}>
                {has_form_progress && (
                    <React.Fragment>
                        <DesktopWrapper>
                            <FormProgress steps={steps} current_step={step} />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <div className='wizard__header-steps'>
                                <h4 className='wizard__header-steps-title'>
                                    {`Step ${step + 1}: ${steps[step].header.title} (${step + 1} of ${steps.length})`}
                                </h4>
                                {steps[step].header.active_title && (
                                    <h4 className='wizard__header-steps-subtitle'>{steps[step].header.active_title}</h4>
                                )}
                            </div>
                        </MobileWrapper>
                    </React.Fragment>
                )}
                <div className='wizard__header'>
                    {has_prev && prevButton()}
                    {has_next && nextButton()}
                </div>
                <Step>{component}</Step>
            </div>
        );
    }
);

Wizard.displayName = 'Wizard';
Wizard.Step = Step;

Wizard.propTypes = {
    className: PropTypes.string,
    lbl_previous: PropTypes.string,
    has_prev: PropTypes.bool,
    lbl_next: PropTypes.string,
    has_next: PropTypes.bool,
    has_form_progress: PropTypes.bool,
    steps: PropTypes.array,
};

export default Wizard;

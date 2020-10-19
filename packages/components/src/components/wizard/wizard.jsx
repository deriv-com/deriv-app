import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Header from './wizard-header.jsx';
import Icon from '../icon/icon.jsx';

const Wizard = React.forwardRef(({ children, steps, lbl_previous, has_prev, lbl_next, has_next, className }, ref) => {
    const [step, setStep] = React.useState(0);
    const [component, setComponent] = React.useState(steps[0].component);
    const last_step = steps.length - 1;

    const nextStep = () => {
        const next_step = step + 1;
        const is_last_step = next_step > last_step;
        if (is_last_step) return;
        setStep(next_step);
        setComponent(steps[next_step].component);
    };

    const prevStep = () => {
        const prev_step = step - 1;
        const is_first_step = prev_step < 0;
        if (is_first_step) return;
        setStep(prev_step);
        setComponent(steps[prev_step].component);
    };

    const selectStep = selected_step => {
        const is_prev_step_not_allowed = selected_step < 0;
        const is_next_step_not_allowed = selected_step > last_step;
        if (is_prev_step_not_allowed || is_next_step_not_allowed) return;
        setStep(selected_step);
        setComponent(steps[selected_step].component);
    };

    React.useImperativeHandle(ref, () => ({
        prevStep,
        nextStep,
        selectStep,
    }));

    const prevButton = () =>
        step === 0 ? (
            <div className='wizard__placeholder' />
        ) : (
            <div role='button' onClick={prevStep} className='wizard__btn wizard__btn-left'>
                <Icon icon='IcArrowLeftBold' className='wizard__btn-icon-left' />
                {lbl_previous}
            </div>
        );

    const nextButton = () =>
        step === last_step ? (
            <div className='wizard__placeholder' />
        ) : (
            <div role='button' onClick={nextStep} className='wizard__btn wizard__btn-right'>
                {lbl_next}
                <Icon icon='IcArrowRightBold' className='wizard__btn-icon-right' />
            </div>
        );

    return (
        <div className={classNames('wizard', className)}>
            {children}
            <div className='wizard__header'>
                {has_prev && prevButton()}
                {has_next && nextButton()}
            </div>
            {component}
        </div>
    );
});

Wizard.displayName = 'Wizard';
Wizard.Header = Header;

Wizard.propTypes = {
    className: PropTypes.string,
    lbl_previous: PropTypes.string,
    has_prev: PropTypes.bool,
    lbl_next: PropTypes.string,
    has_next: PropTypes.bool,
    steps: PropTypes.array,
};

export default Wizard;

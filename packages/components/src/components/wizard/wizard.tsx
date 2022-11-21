import React from 'react';
import classNames from 'classnames';
import Step from './wizard-step';

type TWizard = {
    className?: string;
    initial_step: number;
    onStepChange?: (prop: { [key: string]: number }) => void;
    nav: React.ReactNode;
    selected_step_ref: () => React.MutableRefObject<HTMLElement>;
};

const Wizard = ({
    children = [],
    className,
    initial_step = 1,
    onStepChange,
    nav = null,
    selected_step_ref,
}: React.PropsWithChildren<TWizard>) => {
    const [active_step, setActiveStep] = React.useState(0);

    const getSteps = React.useCallback(() => React.Children.toArray(children), [children]);

    React.useEffect(() => {
        const local_initial_step = initial_step - 1;
        const local_children = getSteps();

        if (local_initial_step && local_children[local_initial_step]) {
            setActiveStep(initial_step);
        }
    }, [initial_step, getSteps]);

    const onChangeStep = (stats: { [key: string]: number }) => {
        // User callback
        onStepChange?.(stats);
    };

    const isInvalidStep = (next: number) => next < 0 || next >= getTotalSteps();

    const onSetActiveStep = (next: number) => {
        if (active_step === next || isInvalidStep(next)) return;
        setActiveStep(next);
        onChangeStep({
            active_step: next + 1,
        });
    };

    const getCurrentStep = () => active_step + 1;

    const getTotalSteps = () => getSteps().length;

    const goToStep = (step: number) => onSetActiveStep(step - 1);

    const goToFirstStep = () => goToStep(1);

    const goToLastStep = () => goToStep(getTotalSteps());

    const goToNextStep = () => onSetActiveStep(active_step + 1);

    const goToPreviousStep = () => onSetActiveStep(active_step - 1);

    const properties = {
        getCurrentStep,
        getTotalSteps,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        goToFirstStep,
        goToLastStep,
        selected_step_ref,
    };

    const childrenWithProps = React.Children.map(getSteps(), (child, i) => {
        if (!child) return null;

        if (i === active_step)
            return (
                <Wizard.Step>{React.isValidElement(child) ? React.cloneElement(child, properties) : child}</Wizard.Step>
            );

        return null;
    });

    return (
        <div className={classNames('wizard', className)}>
            {nav && React.isValidElement(nav) && React.cloneElement(nav, properties)}
            {childrenWithProps}
        </div>
    );
};

Wizard.displayName = 'Wizard';
Wizard.Step = Step;

export default Wizard;

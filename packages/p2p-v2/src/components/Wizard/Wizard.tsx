//TODO: Below component to be removed once wizard fom deriv-com/ui is ready
import React, {
    Children,
    cloneElement,
    isValidElement,
    MutableRefObject,
    PropsWithChildren,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react';
import clsx from 'clsx';
import Step from './WizardStep';
import './Wizard.scss';

type TWizard = {
    className?: string;
    initialStep: number;
    nav: ReactNode;
    onStepChange?: (prop: { [key: string]: number }) => void;
    selectedStepRef?: () => MutableRefObject<HTMLElement>;
};

const Wizard = ({
    children = [],
    className,
    initialStep = 0,
    nav = null,
    onStepChange,
    selectedStepRef,
}: PropsWithChildren<TWizard>) => {
    const [activeStep, setActiveStep] = useState(0);

    const getSteps = useCallback(() => Children.toArray(children), [children]);

    useEffect(() => {
        const localChildren = getSteps();

        if (initialStep > 0 && localChildren[initialStep]) {
            setActiveStep(initialStep);
        }
    }, [initialStep, getSteps]);

    const onChangeStep = (stats: { [key: string]: number }) => {
        // User callback
        onStepChange?.(stats);
    };

    const isInvalidStep = (next: number) => next < 0 || next >= getTotalSteps();

    const onSetActiveStep = (next: number) => {
        if (activeStep === next || isInvalidStep(next)) return;
        setActiveStep(next);
        onChangeStep({
            activeStep: next + 1,
        });
    };

    const getCurrentStep = () => activeStep + 1;

    const getTotalSteps = () => getSteps().length;

    const goToStep = (step: number) => onSetActiveStep(step - 1);

    const goToFirstStep = () => goToStep(1);

    const goToLastStep = () => goToStep(getTotalSteps());

    const goToNextStep = () => onSetActiveStep(activeStep + 1);

    const goToPreviousStep = () => onSetActiveStep(activeStep - 1);

    const properties = {
        getCurrentStep,
        getTotalSteps,
        goToFirstStep,
        goToLastStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        selectedStepRef,
    };

    const childrenWithProps = Children.map(getSteps(), (child, i) => {
        if (!child) return null;

        if (i === activeStep)
            return <Wizard.Step>{isValidElement(child) ? cloneElement(child, properties) : child}</Wizard.Step>;

        return null;
    });

    return (
        <div className={clsx('p2p-v2-wizard', className)}>
            {nav && isValidElement(nav) && cloneElement(nav, properties)}
            {childrenWithProps}
        </div>
    );
};

Wizard.displayName = 'Wizard';
Wizard.Step = Step;

export default Wizard;

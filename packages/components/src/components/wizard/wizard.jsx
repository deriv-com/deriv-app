import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Step from './wizard-step.jsx';

const Wizard = ({ children, className, initial_step, onStepChange, nav, selected_step_ref }) => {
    const [active_step, setActiveStep] = React.useState(0);

    React.useEffect(() => {
        const local_initial_step = initial_step - 1;
        const local_children = getSteps();

        if (local_initial_step && local_children[local_initial_step]) {
            setActiveStep(initial_step);
        }
    }, [initial_step, getSteps]);

    const onChangeStep = stats => {
        // User callback
        onStepChange(stats);
    };

    const isInvalidStep = next => next < 0 || next >= getTotalSteps();

    const onSetActiveStep = next => {
        if (active_step === next || isInvalidStep(next)) return;
        setActiveStep(next);
        onChangeStep({
            active_step: next + 1,
        });
    };

    const getSteps = React.useCallback(() => React.Children.toArray(children), [children]);

    const getCurrentStep = () => active_step + 1;

    const getTotalSteps = () => getSteps().length;

    const goToStep = step => onSetActiveStep(step - 1);

    const goToFirstStep = () => goToStep(1);

    const goToLastStep = () => goToStep(getTotalSteps());

    const goToNextStep = () => onSetActiveStep(active_step + 1);

    const goToPreviousStep = () => onSetActiveStep(active_step - 1);

    // Allows for using HTML elements as a step
    const isReactComponent = ({ type }) => typeof type === 'function' || typeof type === 'object';

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
            return <Wizard.Step>{isReactComponent(child) ? React.cloneElement(child, properties) : child}</Wizard.Step>;

        return null;
    });

    return (
        <div className={classNames('wizard', className)}>
            {nav && React.cloneElement(nav, properties)}
            {childrenWithProps}
        </div>
    );
};

Wizard.displayName = 'Wizard';
Wizard.Step = Step;

Wizard.defaultProps = {
    children: [],
    initial_step: 1,
    onStepChange: () => {},
    nav: null,
};

Wizard.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    initial_step: PropTypes.number,
    onStepChange: PropTypes.func,
    nav: PropTypes.node,
};

export default Wizard;

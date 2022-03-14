# Wizard component

Use this component to create a custom wizard

#### Supported Events:

-   onStepChange

## Usage

```jsx
import { Wizard } from 'deriv-components';

const DummyComponent = props => {
    const Controller = ({
        getCurrentStep,
        getTotalSteps,
        goToFirstStep,
        goToStep,
        goToLastStep,
        goToNextStep,
        goToPreviousStep,
    }) => (
        <React.Fragment>
            <div>
                {getCurrentStep() > 1 && <button onClick={() => goToPreviousStep()}>Previous</button>}
                <button onClick={() => goToNextStep()}>{getCurrentStep() < getTotalSteps() ? 'Next' : 'Finish'}</button>
            </div>
        </React.Fragment>
    );

    const StepOne = props => {
        return (
            <div>
                <Text>Step {props.getCurrentStep()}</Text>
                <Controller {...props} />
            </div>
        );
    };

    const StepTwo = props => {
        return (
            <div>
                <Text>Step {props.getCurrentStep()}</Text>
                <Controller {...props} />
            </div>
        );
    };

    return (
        <Wizard>
            <StepOne />
            <StepTwo />
        </Wizard>
    );
};
```

## Props

| Name         | Type       | Default    | Description                                   |
| ------------ | ---------- | ---------- | --------------------------------------------- |
| className    | {string}   | `''`       | additional custom class name for progress bar |
| initial_step | {number}   | `1`        | initial active step on component load         |
| onStepChange | {function} | `() => {}` | callback function when current step change    |
| nav          | {node}     | `null`     | additional header navigation guide            |

## Controller

| Name             | Type       | Description                             |
| ---------------- | ---------- | --------------------------------------- |
| getCurrentStep   | {function} | returns the current step of the wizard  |
| getTotalSteps    | {function} | returns the total steps of the wizard   |
| goToFirstStep    | {function} | jumps to the first step of the wizard   |
| goToStep         | {function} | jump to specific step in the wizard     |
| goToLastStep     | {function} | jump to the last step of the wizard     |
| goToNextStep     | {function} | jump to the next step of the wizard     |
| goToPreviousStep | {function} | jump to the previous step of the wizard |

## Full example:

```jsx
import { Wizard } from 'deriv-components';

const DummyComponent = props => {
    const Controller = ({
        getCurrentStep,
        getTotalSteps,
        goToFirstStep,
        goToStep,
        goToLastStep,
        goToNextStep,
        goToPreviousStep,
    }) => (
        <React.Fragment>
            <div>
                {getCurrentStep() > 1 && <button onClick={() => goToPreviousStep()}>Previous</button>}
                <button onClick={() => goToNextStep()}>{getCurrentStep() < getTotalSteps() ? 'Next' : 'Finish'}</button>
            </div>
        </React.Fragment>
    );

    const Nav = ({ getCurrentStep, getTotalSteps }) => {
        return (
            <strong>
                Step {getCurrentStep()} of {getTotalSteps()}
            </strong>
        );
    };

    const StepOne = props => {
        return (
            <div>
                <Text>Step {props.getCurrentStep()}</Text>
                <Controller {...props} />
            </div>
        );
    };

    const StepTwo = props => {
        return (
            <div>
                <Text>Step {props.getCurrentStep()}</Text>
                <Controller {...props} />
            </div>
        );
    };

    return (
        <Wizard
            className='wizard-class'
            initial_step={2}
            onStepChange={step => console.log(`the active step is ${step}`)}
            nav={<Nav />}
        >
            <StepOne />
            <StepTwo />
        </Wizard>
    );
};
```

import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Wizard from 'Components/wizard';
import Button from 'Components/button';
import { FlexWrapper, GroupWrapper, ButtonWrapper, Text } from '../button/shared-style';
import Theme from '../shared/theme';

const stories = storiesOf('Wizard', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

const Controller = ({ currentStep, firstStep, goToStep, lastStep, nextStep, previousStep, totalSteps, step }) => (
    <React.Fragment>
        <ButtonWrapper>
            {step > 1 && (
                <Button has_effect secondary small onClick={() => previousStep()}>
                    Go Back
                </Button>
            )}
            <Button has_effect primary small onClick={() => nextStep()}>
                {step < totalSteps() ? 'Continue' : 'Finish'}
            </Button>
        </ButtonWrapper>
        <hr />
        <div>
            <Text size='1.4rem'>Other Functions</Text>
            <Text size='1.2rem'>Current Step: {currentStep()}</Text>
            <Text size='1.2rem'>Total Steps: {totalSteps()}</Text>
            <div>
                <Button has_effect secondary small onClick={() => firstStep()}>
                    First Step
                </Button>
                <Button has_effect secondary small onClick={() => lastStep()}>
                    Last Step
                </Button>
                {step !== 2 && (
                    <Button has_effect secondary small onClick={() => goToStep(2)}>
                        Go to Step 2
                    </Button>
                )}
            </div>
        </div>
    </React.Fragment>
);

const StepOne = props => {
    return (
        <div>
            <Text size='1.6rem'>Customized Contents {props.currentStep()}</Text>
            <Controller step={1} {...props} />
        </div>
    );
};

const StepTwo = props => {
    return (
        <div>
            <Text size='1.6rem'>Customized Contents {props.currentStep()}</Text>
            <Controller step={2} {...props} />
        </div>
    );
};

const StepThree = props => {
    return (
        <div>
            <Text size='1.6rem'>Customized Contents {props.currentStep()}</Text>
            <Controller step={3} {...props} />
        </div>
    );
};

stories.add('Basic Usage', () => {
    return (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <Wizard>
                    <StepOne />
                    <StepTwo />
                    <StepThree />
                </Wizard>
            </FlexWrapper>
        </Theme>
    );
});

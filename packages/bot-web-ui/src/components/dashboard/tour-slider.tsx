import React from 'react';
import { ProgressBarOnboarding, Text } from '@deriv/components';
import { DBOT_ONBOARDING } from './joyride-config';

const TourSlider = () => {
    const [step, setStep] = React.useState<number>(1);

    const toggleStep = (param: string) => {
        if (param === 'inc' && step < Object.keys(DBOT_ONBOARDING).length) setStep(step + 1);
        else if (param === 'dec' && step > 1) setStep(step - 1);
    };

    return (
        <>
            <div className='dbot__slider__wrapper'>
                <Text className='dbot__slider__wrapper__header' as='p' weight='bold' line_height='s' size='xs'>
                    Get started on DBot
                </Text>
                <Text className='dbot__slider__wrapper__content' as='p' line_height='s' size='xxs'>
                    Hi [first name]! Hit Start for a quick tour to help you get started.
                </Text>
                <div className='dbot__slider__wrapper__progress-bar'>
                    <ProgressBarOnboarding
                        step={step}
                        amount_of_steps={Object.keys(DBOT_ONBOARDING)}
                        setStep={setStep}
                    />
                </div>
                <div className='dbot__slider__wrapper__button-group'>
                    <button className='dbot__slider__wrapper__button-group__left' onClick={() => toggleStep('dec')}>
                        <Text weight='bold' line_height='s' size='xs'>
                            Skip
                        </Text>
                    </button>
                    <button className='dbot__slider__wrapper__button-group__right' onClick={() => toggleStep('inc')}>
                        <Text weight='bold' line_height='s' size='xs'>
                            Start
                        </Text>
                    </button>
                </div>
            </div>
        </>
    );
};

export default TourSlider;

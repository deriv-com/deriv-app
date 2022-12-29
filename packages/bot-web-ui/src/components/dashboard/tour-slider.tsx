import React from 'react';
import { ProgressBarOnboarding, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { DBOT_ONBOARDING_MOBILE } from './joyride-config';

type TTourButton = {
    children?: React.ReactNode;
    buttonType: string;
};
type TButtonType = {
    default: { [key: string]: string } | string;
    danger: { [key: string]: string } | string;
};

const BUTTON_TYPE_CLASSES: TButtonType = {
    default: 'dbot__slider__button-group--default',
    danger: 'dbot__slider__button-group--danger',
};

const TourButton = ({ children, buttonType, ...otherProps }: TTourButton) => {
    return (
        <button className={`${BUTTON_TYPE_CLASSES[buttonType]}`} {...otherProps}>
            <Text align='center' weight='bold' as='span' line_height='s' size='xs'>
                {localize(children)}
            </Text>
        </button>
    );
};

const TourSlider = () => {
    const [step, setStep] = React.useState<number>(1);
    const [header, setHeader] = React.useState<string>('');
    const [content, setContent] = React.useState<string>('');

    const toggleStep = (param: string) => {
        if (param === 'inc' && step < Object.keys(DBOT_ONBOARDING_MOBILE).length) setStep(step + 1);
        else if (param === 'dec' && step > 1) setStep(step - 1);
    };
    React.useEffect(() => {
        Object.values(DBOT_ONBOARDING_MOBILE).forEach(data => {
            if (data.key === step) {
                setHeader(data?.header);
                setContent(data?.content);
            }
        });
    }, [step]);

    return (
        <>
            <div className='dbot__slider__wrapper'>
                {header && (
                    <Text
                        align='center'
                        className='dbot__slider__wrapper__header'
                        as='span'
                        weight='bold'
                        line_height='s'
                        size='xs'
                    >
                        {header}
                    </Text>
                )}
                {content && (
                    <Text
                        align='center'
                        className='dbot__slider__wrapper__content'
                        as='span'
                        line_height='s'
                        size='xxs'
                    >
                        {content}
                    </Text>
                )}
                <div className='dbot__slider__wrapper__status'>
                    <div className='dbot__slider__wrapper__progress-bar'>
                        <ProgressBarOnboarding
                            step={step}
                            amount_of_steps={Object.keys(DBOT_ONBOARDING_MOBILE)}
                            setStep={setStep}
                        />
                    </div>
                    <div className='dbot__slider__button-group'>
                        {step !== 1 && (
                            <TourButton buttonType='default' onClick={() => toggleStep('dec')}>
                                Previous
                            </TourButton>
                        )}
                        <TourButton buttonType='danger' onClick={() => toggleStep('inc')}>
                            Next
                        </TourButton>
                    </div>
                    x
                </div>
            </div>
        </>
    );
};

export default TourSlider;

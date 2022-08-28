import React from 'react';
import { Button, Text, Icon } from '@deriv/components';

import './onboarding.scss';

type TOnboardingProps = {
    contents: Record<
        string,
        {
            component: React.ReactNode;
            footer_header: string;
            footer_text: string;
            next_content?: string;
            has_next_content: boolean;
        }
    >;
};

const Onboarding = ({ contents }: TOnboardingProps) => {
    const amount_of_steps = Object.keys(contents).map(content => content);

    const [step, setStep] = React.useState<number>(1);

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const nextStep = () => {
        if (step < amount_of_steps.length) setStep(step + 1);
    };

    const onboarding_step = `step${step}`;

    return (
        <div className='onboarding-wrapper'>
            <div className='onboarding-header'>
                <Icon icon='IcWalletDeriv' height={96} width={128} />
                <Icon icon='IcCross' custom_color='#fff' className='onboarding-header__cross-icon' />
            </div>
            <div className='onboarding-body'>
                <Text as='h2' weight='bold' size='s' align='center' color='white'>
                    {contents[onboarding_step as keyof typeof contents]?.component}
                </Text>
            </div>
            <div className='onboarding-footer'>
                <div className='onboarding-footer-wrapper'>
                    <Text as='h2' weight='bold' size='sm' align='center' className='onboarding-footer-header'>
                        {contents[onboarding_step as keyof typeof contents]?.footer_header}
                    </Text>
                    <Text as='p' size='xs' align='center' className='onboarding-footer-text'>
                        {contents[onboarding_step as keyof typeof contents]?.footer_text}
                    </Text>
                    <div className='onboarding-footer-buttons'>
                        <Button secondary onClick={prevStep} style={step === 1 ? { visibility: 'hidden' } : {}}>
                            Back
                        </Button>
                        <Button primary onClick={nextStep}>
                            {contents[onboarding_step as keyof typeof contents]?.has_next_content
                                ? contents[onboarding_step as keyof typeof contents]?.next_content
                                : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;

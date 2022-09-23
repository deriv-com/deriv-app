import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Text, Icon, ProgressBarOnboarding } from '@deriv/components';

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
    setIsTourOpen: (is_tour_open: boolean) => void;
};

const Onboarding = ({ contents, setIsTourOpen }: TOnboardingProps) => {
    const number_of_steps = Object.keys(contents);

    const [step, setStep] = React.useState<number>(1);

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const nextStep = () => {
        if (step < number_of_steps.length) setStep(step + 1);
        if (step === number_of_steps.length) {
            setIsTourOpen(true);
        }
    };

    const onboarding_step = number_of_steps[step - 1];

    return (
        <div className='onboarding-wrapper'>
            <div className='onboarding-header'>
                <Icon icon='IcWalletDeriv' height={96} width={128} />
                <Icon icon='IcCross' custom_color='var(--general-main-1)' className='onboarding-header__cross-icon' />
            </div>
            <div className='onboarding-body'>
                <Text as='h2' weight='bold' align='center' color='white'>
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
                            {localize('Back')}
                        </Button>
                        <ProgressBarOnboarding step={step} amount_of_steps={number_of_steps} setStep={setStep} />
                        <Button primary onClick={nextStep}>
                            {contents[onboarding_step as keyof typeof contents]?.has_next_content
                                ? contents[onboarding_step as keyof typeof contents]?.next_content
                                : localize('Next')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;

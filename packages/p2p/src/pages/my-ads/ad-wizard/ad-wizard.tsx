import React from 'react';
import { DesktopWrapper, FormProgress, Icon, MobileWrapper, Text, Wizard } from '@deriv/components';
import { Localize } from 'Components/i18next';
import AdConditionsSection from 'Pages/my-ads/ad-conditions-section';
import AdPaymentDetailsSection from 'Pages/my-ads/ad-payment-details-section';
import AdProgressBar from 'Pages/my-ads/ad-progress-bar';
import AdTypeSection from 'Pages/my-ads/ad-type-section';

type TStep = { header: { active_title: string; title: string }; sub_step_count: number };
type TAdWizardNav = {
    action: string;
    steps: TStep[];
};

const AdWizard = ({ action, steps }: TAdWizardNav) => {
    const [current_step, setCurrentStep] = React.useState(0);

    return (
        <Wizard
            className='ad-wizard'
            initial_step={0}
            onStepChange={step => setCurrentStep(step.active_step - 1)}
            nav={
                <>
                    <DesktopWrapper>
                        <FormProgress steps={steps} current_step={current_step} />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <div>
                            <AdProgressBar current_step={current_step} steps={steps} />
                            <div>
                                <Text size='xs' weight='bold'>
                                    <Localize
                                        i18n_default_text='{{title}}'
                                        values={{
                                            title: steps[current_step].header.title,
                                        }}
                                    />
                                </Text>
                                {steps[current_step + 1] ? (
                                    <Text as='div' color='less-prominent' size='xs'>
                                        <Localize
                                            i18n_default_text='Next: {{title}}'
                                            values={{
                                                title: steps[current_step + 1].header.title,
                                            }}
                                        />
                                    </Text>
                                ) : (
                                    <Text as='div' color='less-prominent' size='xs'>
                                        <Localize i18n_default_text='Last step' />
                                    </Text>
                                )}
                            </div>
                            <Icon icon='IcCross' />
                        </div>
                    </MobileWrapper>
                </>
            }
        >
            <AdTypeSection action={action} />
            <AdPaymentDetailsSection />
            <AdConditionsSection />
        </Wizard>
    );
};

export default AdWizard;

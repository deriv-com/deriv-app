import React, { useState } from 'react';
import { FormProgress, Wizard } from '@/components';
import { Text, useDevice } from '@deriv-com/ui';
import { AdProgressBar } from '../AdProgressBar';
import { AdTypeSection } from '../AdTypeSection';
import './AdWizard.scss';

type TStep = { header: { title: string }; subStepCount: number };
type TAdWizardNav = {
    currency: string;
    localCurrency: string;
    rateType: string;
    steps: TStep[];
};

const AdWizard = ({ currency, localCurrency, rateType, steps }: TAdWizardNav) => {
    const { isMobile } = useDevice();
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <Wizard
            className='p2p-v2-ad-wizard'
            initialStep={0}
            nav={
                <>
                    {!isMobile ? (
                        <FormProgress currentStep={currentStep} steps={steps} />
                    ) : (
                        <div>
                            <AdProgressBar currentStep={currentStep} steps={steps} />
                            <div>
                                <Text size='xs' weight='bold'>
                                    {`${steps[currentStep].header.title}`}
                                </Text>
                                {steps[currentStep + 1] ? (
                                    <Text as='div' color='less-prominent' size='xs'>
                                        {`Next: ${steps[currentStep + 1].header.title}`}
                                    </Text>
                                ) : (
                                    <Text as='div' color='less-prominent' size='xs'>
                                        Last step
                                    </Text>
                                )}
                            </div>
                            {/* <Icon icon='IcCross' /> */}
                        </div>
                    )}
                </>
            }
            onStepChange={step => setCurrentStep(step.active_step - 1)}
        >
            <AdTypeSection currency={currency} localCurrency={localCurrency} rateType={rateType} />
        </Wizard>
    );
};

export default AdWizard;

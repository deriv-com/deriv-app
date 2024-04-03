import React, { useState } from 'react';
import { TStep } from 'types';
import { FormProgress, Wizard } from '@/components';
import { LabelPairedXmarkLgBoldIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { AdPaymentDetailsSection } from '../AdPaymentDetailsSection';
import { AdProgressBar } from '../AdProgressBar';
import { AdTypeSection } from '../AdTypeSection';
import './AdWizard.scss';

type TAdWizardNav = {
    currency: string;
    localCurrency?: string;
    rateType: string;
    steps: TStep[];
};

const AdWizard = ({ currency, localCurrency, rateType, steps }: TAdWizardNav) => {
    const { isDesktop } = useDevice();
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <Wizard
            className='p2p-v2-ad-wizard'
            initialStep={0}
            nav={
                <div>
                    {isDesktop ? (
                        <FormProgress currentStep={currentStep} steps={steps} />
                    ) : (
                        <div className='flex items-center justify-around'>
                            <AdProgressBar currentStep={currentStep} steps={steps} />
                            <div>
                                <Text weight='bold'>{steps[currentStep].header.title}</Text>
                                {steps[currentStep + 1] ? (
                                    <Text as='div' color='less-prominent'>
                                        {`Next: ${steps[currentStep + 1].header.title}`}
                                    </Text>
                                ) : (
                                    <Text as='div' color='less-prominent'>
                                        Last step
                                    </Text>
                                )}
                            </div>
                            <Button color='white' icon={<LabelPairedXmarkLgBoldIcon />} variant='contained' />
                        </div>
                    )}
                </div>
            }
            onStepChange={step => setCurrentStep(step.activeStep - 1)}
        >
            <AdTypeSection currency={currency} localCurrency={localCurrency} rateType={rateType} />
            <AdPaymentDetailsSection currency={currency} localCurrency={localCurrency} rateType={rateType} />
        </Wizard>
    );
};

export default AdWizard;

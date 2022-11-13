import React from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { ResidenceList } from '@deriv/api-types';
import { Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { Wizard } from '@deriv/ui';
import CancelWizardDialog from '../cancel-wizard-dialog';
import CountrySelector from '../country-selector';
import './signup-wizard.scss';

type TSignupWizardProps = {
    closeWizard: VoidFunction;
};

const SignupWizard = ({ closeWizard }: TSignupWizardProps) => {
    const [is_cancel_wizard_dialog_active, setIsCancelWizardDialogActive] = React.useState(false);
    const [current_step_key, setCurrentStepKey] = React.useState<string>();
    const [is_country_selected, setIsCountrySelected] = React.useState(false);
    const is_final_step = current_step_key === 'complete_step';

    const onClose = () => {
        setIsCancelWizardDialogActive(true);
    };

    const onComplete = () => {
        //handle some logic
        closeWizard();
    };

    const selectedCountry = (country: ResidenceList[0]) => {
        if (country) {
            setIsCountrySelected(true);
        }
    };

    const onChangeStep = (_current_step: number, _current_step_key?: string) => {
        setCurrentStepKey(_current_step_key);
    };

    const wizard_root_el = document.getElementById('wizard_root');

    if (wizard_root_el) {
        return createPortal(
            <>
                <CancelWizardDialog
                    is_visible={is_cancel_wizard_dialog_active}
                    onConfirm={() => closeWizard()}
                    onCancel={() => setIsCancelWizardDialogActive(false)}
                />
                <div
                    className={classNames('pa-signup-wizard', {
                        'pa-signup-wizard--is-cancel-dialog-active': is_cancel_wizard_dialog_active,
                    })}
                >
                    <Wizard
                        has_dark_background
                        lock_final_step={false}
                        onClose={onClose}
                        onComplete={onComplete}
                        wizard_title={localize('Become a payment agent')}
                        primary_button_label={is_final_step ? localize('Submit') : localize('Next')}
                        secondary_button_label={localize('Back')}
                        onChangeStep={onChangeStep}
                    >
                        <Wizard.Step title='Country of issue' is_fullwidth is_submit_disabled={!is_country_selected}>
                            <>
                                <Text as='p' size='m' line-height='m' weight='bold'>
                                    <Localize i18n_default_text='Country of issue' />
                                </Text>
                                <Text as='p' size='xs' line-height='m' className='pa-signup-wizard__step-text'>
                                    <Localize i18n_default_text='First, we’ll need to know the country that your document was issued.' />
                                </Text>
                                <Text
                                    as='p'
                                    size='xs'
                                    color='less-prominent'
                                    line-height='m'
                                    className='pa-signup-wizard__step-hint'
                                >
                                    <Localize i18n_default_text='Note: This helps with determining which documents are to be requested from you.' />
                                </Text>
                                <CountrySelector
                                    className='pa-signup-wizard__step-country-dropdown'
                                    selectedCountry={selectedCountry}
                                />
                            </>
                        </Wizard.Step>
                        <Wizard.Step title='Step 2' is_fullwidth>
                            <>
                                <Text as='p' size='m' line-height='m' weight='bold'>
                                    <Localize i18n_default_text='Step 2: Address verification' />
                                </Text>
                                <Text as='p' size='xs' line-height='m'>
                                    <Localize i18n_default_text="Next, we'll need to verify your address. Fill in your complete and correct address details. An accurate and complete address helps to speed up your verification process." />
                                </Text>
                            </>
                        </Wizard.Step>
                        <Wizard.Step step_key='complete_step' title='Step 3' is_fullwidth>
                            <>
                                <Text as='p' size='m' line-height='m' weight='bold'>
                                    <Localize i18n_default_text='Step 3: Payment agent details' />
                                </Text>
                                <Text as='p' size='xs' line-height='m'>
                                    <Localize i18n_default_text='Please provide your information for verification purposes. If you give us inaccurate information, you may be unable to make deposits or withdrawals.' />
                                </Text>
                            </>
                        </Wizard.Step>
                    </Wizard>
                </div>
            </>,
            wizard_root_el
        );
    }

    return null;
};

export default SignupWizard;

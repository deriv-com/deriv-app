import React from 'react';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import { FormikValues } from 'formik';
import { termsOfUseConfig, TermsOfUse } from '@deriv/account';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';

type TermsOfUseStepProps = {
    onUpdateState: (values: any) => void;
};

const TermsOfUseStep = ({ onUpdateState }: TermsOfUseStepProps) => {
    const { client } = useStores();
    const [is_submit_enabled, setIsSubmitEnabled] = React.useState(false);
    const formik_ref = React.useRef<FormikValues>(null);

    React.useEffect(() => {
        if (is_submit_enabled) {
            onUpdateState(formik_ref.current?.values);
        }
    }, [is_submit_enabled]);

    const { account_settings, upgrade_info, residence_list, landing_company_shortcode } = client;

    const real_account_signup_target = landing_company_shortcode;

    const terms_of_use_config = termsOfUseConfig(
        {
            upgrade_info,
            real_account_signup_target,
            residence_list,
            account_settings,
        },
        TermsOfUse
    );

    const Body = terms_of_use_config.body;

    return (
        <div className='wizard-step'>
            <Text className='wizard-step__header' as='h5' weight='bold' size='m'>
                {localize('Terms of use')}
            </Text>
            <Body
                value={terms_of_use_config.form_value}
                onSubmitEnabledChange={setIsSubmitEnabled}
                selected_step_ref={formik_ref}
                {...terms_of_use_config.props}
            />
        </div>
    );
};

export default observer(TermsOfUseStep);

import React from 'react';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import { FormikValues } from 'formik';
import { termsOfUseConfig, TermsOfUse } from '@deriv/account';
import { MainComponentProps } from '@deriv/ui';

const TermsOfUseStep = ({ onSubmit }: MainComponentProps) => {
    const { client } = useStores();
    const [is_submit_disabled, setIsSubmitDisabled] = React.useState(false);
    const formik_ref = React.useRef<FormikValues>(null);

    React.useEffect(() => {
        if (!is_submit_disabled) {
            onSubmit(formik_ref.current?.values);
        }
    }, [is_submit_disabled]);

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
        <Body
            value={terms_of_use_config.form_value}
            onSubmitEnabledChange={setIsSubmitDisabled}
            selected_step_ref={formik_ref}
            {...terms_of_use_config.props}
        />
    );
};

export default observer(TermsOfUseStep);

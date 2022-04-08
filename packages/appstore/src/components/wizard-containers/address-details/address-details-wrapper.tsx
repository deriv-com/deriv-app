import React from 'react';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import { FormikValues } from 'formik';
import { addressDetailsConfig, AddressDetails } from '@deriv/account';

const AddressDetailsWrapper = ({ onSubmit }: any) => {
    const { client } = useStores();
    const [is_submit_disabled, setIsSubmitDisabled] = React.useState(false);
    const formik_ref = React.useRef<FormikValues>(null);

    React.useEffect(() => {
        if (!is_submit_disabled) {
            onSubmit(formik_ref.current?.values);
        }
    }, [is_submit_disabled]);

    const {
        account_settings,
        upgrade_info,
        residence_list,
        landing_company_shortcode,
        states_list,
        fetchStatesList,
        residence,
    } = client;

    const real_account_signup_target = landing_company_shortcode;

    const address_details_config = addressDetailsConfig(
        {
            upgrade_info,
            real_account_signup_target,
            residence_list,
            account_settings,
        },
        AddressDetails
    );

    const Body = address_details_config.body;

    return (
        <Body
            value={address_details_config.form_value}
            onSubmitEnabledChange={setIsSubmitDisabled}
            selected_step_ref={formik_ref}
            is_gb_residence={residence === 'gb'}
            fetchStatesList={fetchStatesList}
            states_list={states_list}
            {...address_details_config.props}
        />
    );
};

export default observer(AddressDetailsWrapper);

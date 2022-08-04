import React from 'react';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import { FormikValues } from 'formik';
import { addressDetailsConfig, AddressDetails } from '@deriv/account';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';

type AddressDetailsStepProps = {
    onUpdateState: (values: any) => void;
};

const AddressDetailsStep = ({ onUpdateState }: AddressDetailsStepProps) => {
    const { client } = useStores();
    const [is_submit_enabled, setIsSubmitEnabled] = React.useState(false);
    const formik_ref = React.useRef<FormikValues>(null);

    React.useEffect(() => {
        if (!is_submit_enabled) {
            onUpdateState(formik_ref.current?.values);
        }
    }, [is_submit_enabled]);

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
        <div className='wizard-step'>
            <Text className='wizard-step__header' as='h5' weight='bold' size='m'>
                {localize('Address information')}
            </Text>
            <Text className='wizard-step__subheader' as='p' size='xs'>
                {localize(
                    'We need this for verification. If the information you provide is fake or inaccurate, you won’t be able to deposit and withdraw.'
                )}
            </Text>
            <Body
                value={address_details_config.form_value}
                onSubmitEnabledChange={setIsSubmitEnabled}
                selected_step_ref={formik_ref}
                is_gb_residence={residence === 'gb'}
                fetchStatesList={fetchStatesList}
                states_list={states_list}
                {...address_details_config.props}
            />
        </div>
    );
};

export default observer(AddressDetailsStep);

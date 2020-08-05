import { localize } from '@deriv/translations';
import ProofOfIdentityForm from './proof-of-identity.jsx';
import { generateValidationFunction, getDefaultFields } from './form-validations';

const proof_of_identity_config = {
    poi_state: {
        supported_in: ['maltainvest', 'malta', 'svg', 'iom'],
        default_value: '',
        rules: [],
    },
};

export const proofOfIdentityConfig = ({ real_account_signup_target }) => {
    return {
        header: {
            active_title: localize('Complete your proof of identity'),
            title: localize('Proof of identity'),
        },
        body: ProofOfIdentityForm,
        form_value: getDefaultFields(real_account_signup_target, proof_of_identity_config),
        props: {
            validate: generateValidationFunction(real_account_signup_target, proof_of_identity_config),
        },
        passthrough: ['refreshNotifications'],
    };
};

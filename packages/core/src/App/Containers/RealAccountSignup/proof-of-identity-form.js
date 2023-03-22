import { localize } from '@deriv/translations';
import { generateValidationFunction, getDefaultFields, Jurisdiction } from '@deriv/shared';
import ProofOfIdentityForm from './proof-of-identity.jsx';

const proof_of_identity_config = {
    poi_state: {
        supported_in: [Jurisdiction.MALTA_INVEST, 'malta', Jurisdiction.SVG, 'iom'],
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

import { localize } from '@deriv/translations';
import { ProofOfAddressContainer } from '@deriv/account';
import { generateValidationFunction, getDefaultFields } from './form-validations';

const proof_of_address_config = {
    poi_state: {
        supported_in: ['maltainvest', 'malta', 'svg', 'iom'],
        default_value: '',
        rules: [],
    },
};

export const proofOfAddressConfig = ({ can_upgrade_to }) => {
    return {
        header: {
            active_title: localize('Complete your proof of address'),
            title: localize('Proof of address'),
        },
        body: ProofOfAddressContainer,
        form_value: getDefaultFields(can_upgrade_to, proof_of_address_config),
        props: {
            validate: generateValidationFunction(can_upgrade_to, proof_of_address_config),
        },
        passthrough: ['refreshNotifications'],
    };
};

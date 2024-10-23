import { localize } from '@deriv/translations';
import { config } from '../constants/config';

// TODO: use-shared-functions - These functions are duplicates of trader ones, export and use these instead.
export const getContractTypeName = contract => {
    const { opposites } = config;
    let name = localize('Unknown');

    Object.keys(opposites).forEach(opposites_name => {
        const contract_type_objs = opposites[opposites_name];

        contract_type_objs.forEach(contract_type_obj => {
            const contract_type_names = Object.entries(contract_type_obj)[0]; // ['CALL', 'Rise']

            if (contract_type_names[0] === contract.contract_type) {
                name = contract_type_names[1];
            }
        });
    });

    return name;
};

import filesaver from 'file-saver';
import { config } from '../constants/config';

export const saveAs = ({ data, filename, type }) => {
    const blob = new Blob([data], { type });
    filesaver.saveAs(blob, filename);
};

export const getContractTypeOptions = (contract_type, trade_type) => {
    const trade_types = config.opposites[trade_type.toUpperCase()];

    if (!trade_types) {
        return config.NOT_AVAILABLE_DROPDOWN_OPTIONS;
    }

    const contract_options = trade_types.map(type => Object.entries(type)[0].reverse());

    // When user selected a specific contract, only return the contract type they selected.
    if (contract_type !== 'both') {
        return contract_options.filter(option => option[1] === contract_type);
    }

    return contract_options;
};

export const sanitizeCodeForLastestBlockly = (code) => {
    /* eslint-disable no-param-reassign */
    code = code?.replace(/^\s+\n/, '');
    code = code?.replace(/undefined/g, '');

    code = code?.replace(/\n\s+$/, '\n');
    code = code?.replace(/[ \t]+\n/g, '\n');
    code = code?.replace(/\s/g, '');
    code = code?.replace(/function/g, 'function ');
    code = code?.replace(/return/g, 'return ');
    code = code?.replace(/var/g, 'var ');
    code = code?.replace(/}/g, '}; ');
    return code;
    /* eslint-disable no-param-reassign */
}

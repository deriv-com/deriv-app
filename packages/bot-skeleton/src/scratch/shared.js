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

export const sanitizeCodeForLastestBlockly = code => {
    /* eslint-disable no-param-reassign */
    code = code?.replace(/^\s+\n/, ''); // Remove leading whitespace and newline characters.
    code = code?.replace(/undefined/g, ''); // Remove occurrences of the string "undefined".

    code = code?.replace(/\n\s+$/, '\n'); // Remove trailing whitespace after newlines.
    code = code?.replace(/[ \t]+\n/g, '\n'); // Remove extra spaces or tabs before newlines.
    code = code?.replace(/\s+/g, ' '); // Replace consecutive whitespaces with a single space.
    code = code?.replace(/function\s+[A-Za-z_][A-Za-z0-9_]*\(.*\)/g, '\n$&'); // Insert a newline before function definition.
    code = code?.replace(/\b(function|return|var)\b/g, '$1 '); // Add space after keywords "function", "return", and "var".
    return code;
    /* eslint-disable no-param-reassign */
};

export function initializeOrderValues() {
    return {
        ORDER_ATOMIC: 0,
        ORDER_NEW: 1.1,
        ORDER_MEMBER: 1.2,
        ORDER_FUNCTION_CALL: 2,
        ORDER_DECREMENT: 3,
        ORDER_BITWISE_NOT: 4.1,
        ORDER_UNARY_PLUS: 4.2,
        ORDER_UNARY_NEGATION: 4.3,
        ORDER_LOGICAL_NOT: 4.4,
        ORDER_TYPEOF: 4.5,
        ORDER_VOID: 4.6,
        ORDER_DELETE: 4.7,
        ORDER_AWAIT: 4.8,
        ORDER_EXPONENTIATION: 5,
        ORDER_MULTIPLICATION: 5.1,
        ORDER_DIVISION: 5.2,
        ORDER_MODULUS: 5.3,
        ORDER_SUBTRACTION: 6.1,
        ORDER_ADDITION: 6.2,
        ORDER_BITWISE_SHIFT: 7,
        ORDER_INSTANCEOF: 8,
        ORDER_EQUALITY: 9,
        ORDER_BITWISE_AND: 10,
        ORDER_BITWISE_XOR: 11,
        ORDER_BITWISE_OR: 12,
        ORDER_LOGICAL_AND: 13,
        ORDER_LOGICAL_OR: 14,
        ORDER_CONDITIONAL: 15,
        ORDER_ASSIGNMENT: 16,
        ORDER_YIELD: 17,
        ORDER_COMMA: 18,
        ORDER_NONE: 99,
    };
}

import { useStores } from 'Stores';
import { localize } from 'Components/i18next';

export const usePaymentMethodValidator = () => {
    const { my_profile_store } = useStores();
    const no_symbols_regex = /^[a-zA-Z0-9\s\-.@_+#(),:;']+$/;
    const no_symbols_message =
        "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;";
    const max_characters_error_message = '{{field_name}} has exceeded maximum length of 200 characters.';

    // Generates suitable error message
    const setErrorMessage = (user_input, field) => {
        if (!no_symbols_regex.test(user_input)) {
            return localize(no_symbols_message, {
                field_name: my_profile_store.payment_method_field_set[field],
                interpolation: { escapeValue: false }, // To prevent the conversion of characters to UNIcode
            });
        } else if (user_input.length > 200) {
            return localize(max_characters_error_message, {
                field_name: my_profile_store.payment_method_field_set[field],
                interpolation: { escapeValue: false }, // To prevent the conversion of characters to UNIcode
            });
        }
        return null;
    };

    const validateFields = values => {
        const errors = {};
        if (values.account) {
            const account_err_message = setErrorMessage(values.account, 'account');
            if (account_err_message) {
                errors.account = account_err_message;
            }
        }
        if (values.bank_name) {
            const bank_name_err_message = setErrorMessage(values.bank_name, 'bank_name');
            if (bank_name_err_message) {
                errors.bank_name = bank_name_err_message;
            }
        }
        if (values.branch) {
            const branch_err_message = setErrorMessage(values.branch, 'branch');
            if (branch_err_message) {
                errors.branch = branch_err_message;
            }
        }
        if (values.instructions) {
            const instruction_err_message = setErrorMessage(values.instructions, 'instructions');
            if (instruction_err_message) {
                errors.instructions = instruction_err_message;
            }
        }
        if (values.name) {
            const name_err_message = setErrorMessage(values.name, 'name');
            if (name_err_message) {
                errors.name = name_err_message;
            }
        }
        if (values.bank_code) {
            const bank_code_err_message = setErrorMessage(values.bank_code, 'bank_code');
            if (bank_code_err_message) {
                errors.bank_code = bank_code_err_message;
            }
        }
        return errors;
    };
    return validateFields;
};

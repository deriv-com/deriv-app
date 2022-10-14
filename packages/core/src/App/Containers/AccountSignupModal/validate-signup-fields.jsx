import { validPassword, validLength, website_name, getErrorMessages } from '@deriv/shared';
import { localize } from '@deriv/translations';

const validateSignupFields = (values, residence_list) => {
    const errors = {};

    if (
        !validLength(values.password, {
            min: 8,
            max: 25,
        })
    ) {
        errors.password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
            min_number: 8,
            max_number: 25,
        });
    } else if (!validPassword(values.password)) {
        errors.password = getErrorMessages().password();
    }

    if (!values.residence) {
        errors.residence = true;
    } else {
        const index_of_selection = residence_list.findIndex(
            item => item.text.toLowerCase() === values.residence.toLowerCase()
        );

        if (index_of_selection === -1 || residence_list[index_of_selection].disabled === 'DISABLED') {
            errors.residence = localize('Unfortunately, {{website_name}} is not available in your country.', {
                website_name,
            });
        }
    }

    if (!values.citizenship) {
        errors.citizenship = true;
    } else {
        const index_of_selection = residence_list.findIndex(
            item => item.text.toLowerCase() === values.citizenship.toLowerCase()
        );

        if (index_of_selection === -1) {
            errors.citizenship = localize('Unfortunately, {{website_name}} is not available in your country.', {
                website_name,
            });
        }
    }

    return errors;
};

export default validateSignupFields;

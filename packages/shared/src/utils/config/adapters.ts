import { localize } from '@deriv/translations';
import { FormikValues } from 'formik';

/**
 * Formats the IDV form values to be sent to the API
 * @name formatIDVFormValues
 * @param idv_form_value - Formik values of the IDV form
 * @param country_code - Country code of the user
 * @returns IDV form values
 */
export const formatIDVFormValues = (idv_form_value: FormikValues, country_code: string) => {
    const IDV_NOT_APPLICABLE_OPTION = getIDVNotApplicableOption();
    const idv_submit_data = {
        document_number:
            idv_form_value.document_type.id === IDV_NOT_APPLICABLE_OPTION.id
                ? IDV_NOT_APPLICABLE_OPTION.value
                : idv_form_value.document_number,
        document_additional: idv_form_value.document_additional,
        document_type: idv_form_value.document_type.id,
        issuing_country: country_code,
    };
    return idv_submit_data;
};

/**
 * Returns an object that allows user to skip IDV
 */

export const getIDVNotApplicableOption = (is_for_real_account_signup_modal?: boolean) => ({
    id: 'none',
    text: is_for_real_account_signup_modal
        ? localize('I want to do this later')
        : localize("I don't have any of these"),
    value: 'none',
});

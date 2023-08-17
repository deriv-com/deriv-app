import { getIDVNotApplicableOption } from '../constants/idv-options';
import { FormikValues } from 'formik';

type TDocumentList = Array<{
    id: string;
    text: string;
    value?: string;
    sample_image?: string;
    example_format?: string;
    additional?: {
        display_name: string;
        format: string;
    };
}>;

type TIDVFormValues = {
    document_type: TDocumentList[0];
    document_number: string;
    document_additional?: string;
    error_message?: string;
};

/**
 * Formats the IDV form values to be sent to the API
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

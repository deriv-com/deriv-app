import React from 'react';
import { useFormikContext } from 'formik';

export const ScrollToFieldWithError = () => {
    const [all_page_inputs_names, setAllPageInputsNames] = React.useState<string[]>([]);
    const formik = useFormikContext();
    const is_submitting = formik.isSubmitting;

    React.useEffect(() => {
        const inputs = [...document.querySelectorAll('input')];
        setAllPageInputsNames(inputs.map(input => input.name));
    }, []);

    React.useEffect(() => {
        if (!Object.keys(formik.errors).length) return;
        let current_error_field_name = '';
        for (let i = 0; i <= all_page_inputs_names.length; i++) {
            if (Object.hasOwn(formik.errors, all_page_inputs_names[i])) {
                current_error_field_name = all_page_inputs_names[i];
                // setCurrentErrorFieldName(all_page_inputs_names[i]);
                break;
            }
        }

        const el = document.querySelector(`[name="${current_error_field_name}"]`) as HTMLInputElement;
        (el?.parentElement ?? el)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.focus();
    }, [is_submitting]);

    return null;
};

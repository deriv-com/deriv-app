import React from 'react';
import { useFormikContext } from 'formik';

type TScrollToFieldWithError = {
    /**
     * The fields_to_scroll_top is to scroll to top for exact fields.
     */
    fields_to_scroll_top?: string[];
    /**
     * The fields_to_scroll_end is to scroll to end for exact fields.
     */
    fields_to_scroll_end?: string[];
    /**
     * The should_recollect_inputs_names is to recollect all inputs on the page .
     */
    should_recollect_inputs_names?: boolean;
};

/**
 * A ScrollToFieldWithError for scrolling to field with error.
 *
 * **Note**: This component is supposed to be used with Formik.
 * To use scrolling to field with error, you have to use this component within Formik.
 *
 * @name ScrollToFieldWithError
 * @returns {null} React component that renders nothing
 */
const ScrollToFieldWithError = ({
    fields_to_scroll_top,
    fields_to_scroll_end,
    should_recollect_inputs_names = false,
}: TScrollToFieldWithError) => {
    const [all_page_inputs_names, setAllPageInputsNames] = React.useState<string[]>([]);
    const formik = useFormikContext();
    const is_submitting = formik.isSubmitting;
    const scrollToElement = (element_name: string, block: ScrollLogicalPosition = 'center') => {
        const el = document.querySelector(`[name="${element_name}"]`) as HTMLInputElement;
        (el?.parentElement ?? el)?.scrollIntoView({ behavior: 'smooth', block });
        el?.focus();
    };

    React.useEffect(() => {
        const inputs = [...document.querySelectorAll('input, select')] as HTMLInputElement[];
        setAllPageInputsNames(inputs.map(input => input.name));
    }, [should_recollect_inputs_names]);
    React.useEffect(() => {
        let current_error_field_name = '';

        for (let i = 0; i <= all_page_inputs_names.length; i++) {
            if (Object.hasOwn(formik.errors, all_page_inputs_names[i])) {
                current_error_field_name = all_page_inputs_names[i];
                break;
            }
        }

        if (fields_to_scroll_top?.includes(current_error_field_name)) {
            scrollToElement(current_error_field_name, 'start');
        } else if (fields_to_scroll_end?.includes(current_error_field_name)) {
            scrollToElement(current_error_field_name, 'end');
        } else {
            scrollToElement(current_error_field_name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_submitting]);

    return null;
};

export default ScrollToFieldWithError;

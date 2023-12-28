import React from 'react';
import { useFormikContext } from 'formik';

type TScrollToFieldWithError = {
    fields_to_scroll_top?: string[];
    fields_to_scroll_bottom?: string[];
    should_recollect_inputs_names?: boolean;
};

const ScrollToFieldWithError = ({
    fields_to_scroll_top,
    fields_to_scroll_bottom,
    should_recollect_inputs_names = false,
}: TScrollToFieldWithError) => {
    const [all_page_inputs_names, setAllPageInputsNames] = React.useState<string[]>([]);
    const { errors, isSubmitting } = useFormikContext();
    const scrollToElement = (element_name: string, block: ScrollLogicalPosition = 'center') => {
        if (!element_name) return;
        const el = document.querySelector(`[name="${element_name}"]`) as HTMLInputElement;
        const target_element = el?.parentElement ?? el;
        if (typeof target_element?.scrollIntoView === 'function') {
            target_element?.scrollIntoView({ behavior: 'smooth', block });
        }
        if (el?.type !== 'radio') el?.focus();
    };

    React.useEffect(() => {
        const inputs = [...document.querySelectorAll('input, select')] as HTMLInputElement[];
        setAllPageInputsNames(inputs.map(input => input.name));
    }, [should_recollect_inputs_names]);
    React.useEffect(() => {
        const current_error_field_name =
            all_page_inputs_names.find(input_name => Object.prototype.hasOwnProperty.call(errors, input_name)) || '';

        if (fields_to_scroll_top?.includes(current_error_field_name)) {
            scrollToElement(current_error_field_name, 'start');
        } else if (fields_to_scroll_bottom?.includes(current_error_field_name)) {
            scrollToElement(current_error_field_name, 'end');
        } else {
            scrollToElement(current_error_field_name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitting]);

    return null;
};

export default ScrollToFieldWithError;

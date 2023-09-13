import React from 'react';
import { useFormikContext } from 'formik';

export const ScrollToFieldWithError = () => {
    const formik = useFormikContext();
    const is_submitting = formik.isSubmitting;
    const error_field_name = Object.keys(formik.errors)[0];
    React.useEffect(() => {
        const el = document.querySelector(`[name="${error_field_name}"]`) as HTMLInputElement;
        (el?.parentElement ?? el)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.focus();
    }, [is_submitting]);
    return null;
};

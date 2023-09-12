import React from 'react';
import { useFormikContext } from 'formik';

export function ScrollToFieldWithError() {
    const formik = useFormikContext();
    const error_field_name = Object.keys(formik.errors)[0];
    React.useEffect(() => {
        const el = document.querySelector(`input[name="${error_field_name}"]`) as HTMLInputElement;
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.focus();
    }, [error_field_name]);
    return null;
}

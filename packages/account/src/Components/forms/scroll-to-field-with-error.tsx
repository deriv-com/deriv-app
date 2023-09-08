import React from 'react';
import { useFormikContext } from 'formik';

export function ScrollToFieldWithError() {
    const formik = useFormikContext();
    const submitting = formik?.isSubmitting;

    React.useEffect(() => {
        const el = document.querySelector('.dc-input--error');
        (el?.parentElement ?? el)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // (el?.parentElement ?? el)?.focus();
    }, [submitting]);
    return null;
}

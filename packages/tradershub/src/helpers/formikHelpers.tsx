import { useEffect } from 'react';
import { FormikErrors, useFormikContext } from 'formik';

/**
 * Returns an array of error field names using object dot notation for
 * array fields (if any)
 * Example:
 * Input: { name: 'is invalid', items: [{ description: 'is invalid' }] }
 * Output: ['name', 'items.0.description']
 * @param {Object} errors A Formik form errors
 * @returns {Array}
 */
const getFieldErrorNames = (formikErrors: FormikErrors<Record<string, string>>) => {
    const transformObjectToDotNotation = (obj: object, prefix = '', result: string[] = []) => {
        Object.keys(obj).forEach(key => {
            const value = obj[key as keyof typeof obj];
            if (!value) return;

            const nextKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'object') {
                transformObjectToDotNotation(value, nextKey, result);
            } else {
                result.push(nextKey);
            }
        });

        return result;
    };

    return transformObjectToDotNotation(formikErrors);
};

const scrollBehavior = {
    behavior: 'smooth',
    block: 'center',
} as const;

/**
 * Scrolls to the first field with an error when the form is submitted.
 * This is useful for long forms where the error might not be visible
 * to the user.
 *
 * This component should be used inside a Formik component.
 */
export const ScrollToFieldError = ({ fieldOrder }: { fieldOrder?: string[] }) => {
    const { submitCount, isValid, errors } = useFormikContext<Record<string, string>>();

    const fieldErrors: Record<string, string | undefined> = fieldOrder ? {} : errors;

    // Construct errors based on fieldOrder
    fieldOrder?.forEach(key => {
        if (errors[key]) {
            fieldErrors[key] = errors[key];
        }
    });

    useEffect(() => {
        if (isValid) return;

        const fieldErrorNames = getFieldErrorNames(fieldErrors);
        if (fieldErrorNames.length <= 0) return;

        const element = document.querySelector(`input[name='${fieldErrorNames[0]}']`);
        if (!element) return;

        // Scroll to first known error into view
        element.scrollIntoView(scrollBehavior);

        // Formik doesn't (yet) provide a callback for a client-failed submission,
        // thus why this is implemented through a hook that listens to changes on
        // the submit count.
    }, [submitCount]); // eslint-disable-line react-hooks/exhaustive-deps

    return null;
};

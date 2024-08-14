import { useState } from 'react';
import { FormikValues } from 'formik';
import { useSettings } from '@deriv/api-v2';
import { getFormattedDateString } from '../../../../../../../utils/utils';
import type { TVerifyPersonalDetailsValues } from '../types';

const useVerifyPersonalDetails = () => {
    const { data: settings, error, isError, isLoading, isSuccess, update } = useSettings();
    const [isSubmissionInitiated, setIsSubmissionInitiated] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const initialValues = {
        arePersonalDetailsVerified: false,
        dateOfBirth: getFormattedDateString(new Date((settings.date_of_birth ?? 0) * 1000)),
        firstName: settings.first_name,
        lastName: settings.last_name,
    };

    const submit = (values: FormikValues | TVerifyPersonalDetailsValues) => {
        const isDirty =
            settings.date_of_birth !== values.dateOfBirth ||
            settings.first_name !== values.firstName ||
            settings.last_name !== values.lastName;

        if (isDirty) {
            update({
                date_of_birth: values.dateOfBirth,
                first_name: values.firstName,
                last_name: values.lastName,
            });
            setIsSubmissionInitiated(true);
        } else {
            setIsSubmitted(true);
        }
    };

    // hasSubmissionInitiated is used for differentiating initial call's success
    // from submission call's success as useSetting hook does not provide such difference.
    if (isSuccess && isSubmissionInitiated) {
        setIsSubmitted(true);
        setIsSubmissionInitiated(false);
    }

    if (isError) {
        setIsSubmissionInitiated(false);
    }

    return {
        error: error?.error,
        initialValues,
        isLoading,
        isSubmitted,
        isSubmitting: isLoading && isSubmissionInitiated,
        submit,
    };
};

export default useVerifyPersonalDetails;

import { useState } from 'react';
import { FormikValues } from 'formik';
import { useSettings } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { getFormattedDateString } from '../../../../../../../utils/utils';
import type { TVerifyPersonalDetailsValues } from '../types';

const useVerifyPersonalDetails = () => {
    const { data: settings, isLoading, updateAsync } = useSettings();
    const [isSubmissionInitiated, setIsSubmissionInitiated] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const formattedDateOfBirth = getFormattedDateString(new Date((settings.date_of_birth ?? 0) * 1000));

    const initialValues = {
        dateOfBirth: formattedDateOfBirth,
        firstName: settings.first_name,
        lastName: settings.last_name,
    };

    const submit = async (values: FormikValues | TVerifyPersonalDetailsValues) => {
        const isDirty =
            formattedDateOfBirth !== values.dateOfBirth ||
            settings.first_name !== values.firstName ||
            settings.last_name !== values.lastName;

        if (isDirty) {
            setIsSubmissionInitiated(true);

            try {
                await updateAsync({
                    date_of_birth: values.dateOfBirth,
                    first_name: values.firstName,
                    last_name: values.lastName,
                });
                setIsSubmitted(true);
                setIsSubmissionInitiated(false);
                return Promise.resolve();
            } catch (err) {
                setIsSubmissionInitiated(false);
                const error = (err as TSocketError<'set_settings'>).error;
                return Promise.reject(error);
            }
        } else {
            setIsSubmitted(true);
        }
    };

    return {
        initialValues,
        isLoading,
        isSubmitted,
        isSubmitting: isLoading && isSubmissionInitiated,
        submit,
    };
};

export default useVerifyPersonalDetails;

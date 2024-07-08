import { useMemo, useState } from 'react';
import { useSettings } from '@deriv/api-v2';
import { getFormattedDateString } from '../../../../../../utils/utils';
import type { TVerifyPersonalDetailsValues } from './types';

const useVerifyPersonalDetails = () => {
    const { data: settings, error, isError, isLoading, isSuccess, update } = useSettings();
    const [hasSubmissionInitiated, setHasSubmissionInitiated] = useState<boolean>(false);

    const initialFormValues = useMemo(
        () => ({
            areDetailsVerifiedValidator: false,
            dateOfBirth: getFormattedDateString(new Date((settings.date_of_birth ?? 0) * 1000)),
            firstName: settings.first_name,
            lastName: settings.last_name,
        }),
        [settings.date_of_birth, settings.first_name, settings.last_name]
    );

    const submit = <T>(values: T & TVerifyPersonalDetailsValues) => {
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
            setHasSubmissionInitiated(true);
        }
    };

    if (isError) {
        setHasSubmissionInitiated(false);
    }

    // hasSubmissionInitiated is used for differentiating initial calls success
    // from submission calls success as useSetting hook does not provide such difference.
    const isSubmitted = isSuccess && hasSubmissionInitiated;

    return { error, initialFormValues, isLoading, isSubmitted, submit };
};

export default useVerifyPersonalDetails;

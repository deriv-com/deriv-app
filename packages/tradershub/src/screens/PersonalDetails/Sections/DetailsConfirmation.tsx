import React from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Checkbox } from '@deriv-com/ui';

const DetailsConfirmation = () => {
    const { errors, values } = useFormikContext<{
        confirmation: boolean;
        dateOfBirth: string;
        firstName: string;
        lastName: string;
    }>();

    const isDisabled = Boolean(
        !values.firstName ||
            !values.lastName ||
            !values.dateOfBirth ||
            errors.firstName ||
            errors.lastName ||
            errors.dateOfBirth
    );

    return (
        <Field name='confirmation' type='checkbox'>
            {({ field, meta }: FieldProps) => (
                <Checkbox
                    disabled={isDisabled}
                    error={Boolean(meta.error && meta.touched)}
                    id='confirmation'
                    label='I confirm that the name and date of birth above match my chosen identity document.'
                    {...field}
                />
            )}
        </Field>
    );
};

export default DetailsConfirmation;

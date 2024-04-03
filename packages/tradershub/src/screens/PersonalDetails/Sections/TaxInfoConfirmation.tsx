import React from 'react';
import { Field, FieldProps } from 'formik';
import { Checkbox } from '@deriv-com/ui';

const TaxInfoConfirmation = () => {
    return (
        <Field name='taxInfoConfirmation' type='checkbox'>
            {({ field, meta }: FieldProps) => (
                <Checkbox
                    error={Boolean(meta.error && meta.touched)}
                    id='taxInfoConfirmation'
                    label='I confirm that my tax information is accurate and complete.'
                    {...field}
                />
            )}
        </Field>
    );
};

export default TaxInfoConfirmation;

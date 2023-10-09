import React from 'react';
import { FormikValues, useFormikContext } from 'formik';
import { Checkbox } from '@deriv/components';
import { isMobile } from '@deriv/shared';

/**
 * Props for the confirmation checkbox component.
 */
type TConfirmationCheckboxProps = {
    /**
     * The label of the checkbox.
     */
    label: string | React.ReactElement;
    /**
     * The size of the checkbox label.
     */
    label_font_size?: 'xxxxs' | 'xxxs' | 'xxs' | 'xs' | 's' | 'sm' | 'm' | 'l' | 'xl' | 'xxl';
    disabled?: boolean;
};

/**
 * A checkbox component for confirming an action with an optional description.
 *
 * This component renders a checkbox that can be used to confirm an action, such as agreeing to terms
 * and conditions. It also allows displaying an optional description next to the checkbox.
 *
 * **Note**: This component is meant to be used with Formik forms.
 * To use this component, you must set initialStatus in the Formik form to { is_confirmed: false }.
 *
 * @name ConfirmationCheckbox
 * @returns {JSX.Element} React component that renders a checkbox with a label
 */
export const ConfirmationCheckbox = ({ label, label_font_size, disabled = false }: TConfirmationCheckboxProps) => {
    /**
     * The formik context for the current form.
     *
     * This context provides information about the form's state and helps in managing form behavior.
     */
    const { setFieldValue, setStatus, status, values, touched, errors } = useFormikContext<FormikValues>();

    const handleChange = () => {
        // check if status is an object to avoid overwriting the status if it is a string
        if (typeof status === 'object') setStatus({ ...status, is_confirmed: !status?.is_confirmed });
        setFieldValue('confirmation_checkbox', !values.confirmation_checkbox);
    };

    return (
        <Checkbox
            name='confirmation_checkbox'
            className='formik__confirmation-checkbox'
            value={status?.is_confirmed ?? false}
            label={label}
            label_font_size={label_font_size ?? (isMobile() ? 'xxs' : 'xs')}
            disabled={disabled}
            onChange={handleChange}
            has_error={!!(touched.confirmation_checkbox && errors.confirmation_checkbox)}
        />
    );
};

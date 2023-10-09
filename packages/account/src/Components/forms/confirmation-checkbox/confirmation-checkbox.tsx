import React from 'react';
import { useFormikContext } from 'formik';

import { Checkbox, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';

/**
 * Props for the confirmation checkbox component.
 */
type TConfirmationCheckboxProps = {
    /**
     * The label of the checkbox.
     */
    label: React.ReactNode;
    /**
     * The size of the checkbox label.
     */
    label_size?: 'xxxxs' | 'xxxs' | 'xxs' | 'xs' | 's' | 'sm' | 'm' | 'l' | 'xl' | 'xxl';
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
export const ConfirmationCheckbox = ({
    label,
    label_size,
    disabled = false,
}: TConfirmationCheckboxProps): JSX.Element => {
    /**
     * The formik context for the current form.
     *
     * This context provides information about the form's state and helps in managing form behavior.
     */
    const { setStatus, status } = useFormikContext();

    const handleChange = () => {
        // check if status is an object to avoid overwriting the status if it is a string
        if (typeof status === 'object') setStatus({ ...status, is_confirmed: !status?.is_confirmed });
    };

    return (
        <Checkbox
            className='formik__confirmation-checkbox'
            value={status?.is_confirmed ?? false}
            label={<Text size={label_size ?? (isMobile() ? 'xxs' : 'xs')}>{label}</Text>}
            disabled={disabled}
            onChange={handleChange}
        />
    );
};

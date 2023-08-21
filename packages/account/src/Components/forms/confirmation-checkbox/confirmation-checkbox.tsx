import React from 'react';
import { Checkbox, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { useFormikContext } from 'formik';

/**
 * Props for the confirmation checkbox component.
 */
type TConfirmationCheckboxProps = {
    /**
     * A boolean value indicating whether the checkbox is confirmed or not.
     */
    confirmed: boolean;
    /**
     * A React.SetStateAction function to set the confirmed state of the checkbox.
     */
    setConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
    /**
     * The label of the checkbox.
     */
    label: string;
    /**
     * The size of the checkbox label.
     */
    label_size?: 'xxxxs' | 'xxxs' | 'xxs' | 'xs' | 's' | 'sm' | 'm' | 'l' | 'xl' | 'xxl';
};

/**
 * A checkbox component for confirming an action with an optional description.
 *
 * This component renders a checkbox that can be used to confirm an action, such as agreeing to terms
 * and conditions. It also allows displaying an optional description next to the checkbox.
 *
 * **Note**: This component is meant to be used with Formik forms.
 *
 * @name ConfirmationCheckbox
 * @returns {JSX.Element} React component that renders a checkbox with a label
 */
export const ConfirmationCheckbox = ({
    confirmed,
    setConfirmed,
    label,
    label_size,
}: TConfirmationCheckboxProps): JSX.Element => {
    /**
     * The formik context for the current form.
     *
     * This context provides information about the form's state and helps in managing form behavior.
     */
    const { isSubmitting, isValid } = useFormikContext();

    return (
        <Checkbox
            className='formik__confirmation-checkbox'
            value={confirmed}
            label={<Text size={label_size ?? (isMobile() ? 'xxs' : 'xs')}>{label}</Text>}
            disabled={isSubmitting || !isValid}
            onChange={() => setConfirmed(prev_is_confirmed => !prev_is_confirmed)}
        />
    );
};

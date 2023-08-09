import React from 'react';
import { Checkbox, Text } from '@deriv/components';
import { isEmptyObject, isMobile } from '@deriv/shared';
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
};

/**
 * A checkbox component for confirming an action with an optional description.
 *
 * This component renders a checkbox that can be used to confirm an action, such as agreeing to terms
 * and conditions. It also allows displaying an optional description next to the checkbox.
 *
 * @name FormikConfirmationCheckbox
 * @returns {JSX.Element} React component that renders a checkbox with a label
 */
export const FormikConfirmationCheckbox = ({
    confirmed,
    setConfirmed,
    label,
}: TConfirmationCheckboxProps): JSX.Element => {
    /**
     * The formik context for the current form.
     *
     * This context provides information about the form's state and helps in managing form behavior.
     */
    const { dirty, isSubmitting, isValid, errors } = useFormikContext();

    React.useEffect(() => {
        if (!isValid) {
            setConfirmed(false);
        }
    }, [isValid, setConfirmed]);

    return (
        <Checkbox
            className='formik__confirmation-checkbox'
            value={confirmed}
            label={<Text size={isMobile() ? 'xxs' : 'xs'}>{label}</Text>}
            disabled={!dirty || isSubmitting || !isValid || !isEmptyObject(errors)}
            onChange={() => setConfirmed(prev_is_confirmed => !prev_is_confirmed)}
        />
    );
};

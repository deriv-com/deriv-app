import React from 'react';
import { Checkbox, Text } from '@deriv/components';
import { isEmptyObject } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
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
 *  * A checkbox component for confirming an action with an optional description.
 *
 * This component renders a checkbox that can be used to confirm an action, such as agreeing to terms
 * and conditions. It also allows displaying an optional description next to the checkbox.
 *
 * @example
 * // Import the component
 * import FormikConfirmationCheckbox from './FormikConfirmationCheckbox';
 * import { Formik, Form } from 'formik';
 *
 * // Inside a form component
 * const MyForm = () => {
 *     const [isConfirmed, setIsConfirmed] = useState(false);
 *
 *     // Your form logic and onSubmit handler
 *
 *     return (
 *         <Formik ...>
 *             <Form>
 *                <FormikConfirmationCheckbox
 *                  confirmed={isConfirmed}
 *                  setConfirmed={setIsConfirmed}
 *                  label={localize("I confirm my details are correct.")}
 *                />
 *             </Form>
 *         </Formik>
 *     );
 * };
 * @name FormikConfirmationCheckbox
 * @param props - props of the confirmation checkbox
 * @param {boolean} props.confirmed - A boolean value indicating whether the checkbox is confirmed or not
 * @param {function} props.setConfirmed - A React.SetStateAction function to update the state of the confirmation checkbox
 * @param {string} props.label - The label to be displayed next to the confirmation checkbox
 * @returns {React.ReactNode} React component that renders a checkbox with a label
 */
const FormikConfirmationCheckbox = observer(({ confirmed, setConfirmed, label }: TConfirmationCheckboxProps) => {
    /**
     * The formik context for the current form.
     *
     * This context provides information about the form's state and helps in managing form behavior.
     */
    const { dirty, isSubmitting, isValid, errors } = useFormikContext();
    const {
        ui: { is_mobile },
    } = useStore();

    React.useEffect(() => {
        if (!isValid) {
            setConfirmed(false);
        }
    }, [isValid, setConfirmed]);

    return (
        <Checkbox
            value={confirmed}
            label={<Text size={is_mobile ? 'xxs' : 'xs'}>{label}</Text>}
            disabled={!dirty || isSubmitting || !isValid || !isEmptyObject(errors)}
            onChange={() => setConfirmed(prev_is_confirmed => !prev_is_confirmed)}
        />
    );
});

export default FormikConfirmationCheckbox;

import React from 'react';
import { Formik, FormikConfig, FormikProps, FormikValues } from 'formik';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores/index';

/**
 * Formik wrapper that automatically handles saving and restoring form state and values when a modal is unmounted
 * Use this for modals with forms using Formik, that could be temporary hidden in place of another modal,
 * such as an error modal or a message modal like CancelAddPaymentMethodModal
 *
 * Usage: Replace the Formik component with ModalForm, and pass Formik props to it
 */
const ModalForm = (props: FormikConfig<FormikValues>) => {
    const { general_store } = useStores();

    // using a callback ref instead of useRef() since useRef does not automatically update when content changes
    const formik_ref: React.Ref<FormikProps<FormikValues>> = React.useCallback((node: FormikProps<FormikValues>) => {
        if (node) general_store.setFormikRef(node);
    }, []);

    React.useEffect(() => {
        if (general_store.saved_form_state && general_store.formik_ref) {
            general_store.formik_ref.setValues(general_store.saved_form_state.values);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Formik innerRef={formik_ref} {...props}>
            {props.children}
        </Formik>
    );
};

export default observer(ModalForm);

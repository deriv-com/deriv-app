import React from 'react';
import { useFormikContext } from 'formik';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';

const FormHistory = () => {
    const { setValues } = useFormikContext();
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        if (my_profile_store.formik_history) setValues(my_profile_store.form_history);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

/**
 * A hook which provides utilities to store a form's reference using my-profile-store.
 * Once the provided callback ref formikRef is passed to a Formik's inner ref prop, it automatically updates my-profile-store's formik_ref to allow the form's state and values to be accessed anywhere using the store.
 * Additionally, it also updates the form's initial values to a saved historical state and values on mounting when a previous form history is present within my-profile-store.
 *
 * @typedef {object} FormHistory
 * @property {React.Element} FormHistory - An empty component that serves to be mounted within a Formik parent component to collect its context
 * @property {function} formikRef - A callback ref which updates the observable formik_ref within my profile store when Formik's inner ref is automatically updated
 *
 *
 * @returns {FormHistory} An object which contains a component FormHistory and a Ref function to be attached to a Formik's innerRef prop
 */
export const useFormHistory = () => {
    const { my_profile_store } = useStores();

    // using a callback ref instead of useRef() since useRef does not automatically update when content changes
    const formikRef = React.useCallback(node => {
        if (node) my_profile_store.setFormikRef(node);
    });

    return {
        FormHistory: observer(FormHistory),
        formikRef,
    };
};

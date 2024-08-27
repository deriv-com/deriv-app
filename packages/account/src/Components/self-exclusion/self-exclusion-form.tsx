import { useContext } from 'react';
import { Form, Formik } from 'formik';
import SelfExclusionContext from './self-exclusion-context';
import SelfExclusionConfirmPage from './self-exclusion-confirm-page';
import SelfExclusionInputs from './self-exclusion-inputs';

const SelfExclusionForm = () => {
    const { handleSubmit, state, validateFields } = useContext(SelfExclusionContext);

    return (
        <Formik initialValues={state?.self_exclusions} onSubmit={handleSubmit} validate={validateFields}>
            <Form className='da-self-exclusion__form' noValidate>
                {state?.is_confirm_page ? <SelfExclusionConfirmPage /> : <SelfExclusionInputs />}
            </Form>
        </Formik>
    );
};

export default SelfExclusionForm;

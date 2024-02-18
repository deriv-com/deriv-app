import React, { Fragment, useState } from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { FirstSignupScreens } from '../FirstSignupScreens';

export type TFirstSignupFormValues = {
    citizenship: string;
    country: string;
    password: string;
};

const FirstSignupWrapper = () => {
    const [step, setStep] = useState(1);

    const handleSubmit = () => {
        // will be added later
    };

    const handlerValidate = (values: FormikValues) => {
        // will be added later
    };

    const initialValues = {
        country: '',
        citizenship: '',
        password: '',
    };

    return (
        <Fragment>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validate={handlerValidate}
                validateOnChange
            >
                <Form>
                    <FirstSignupScreens setStep={setStep} step={step} />
                </Form>
            </Formik>
        </Fragment>
    );
};

export default FirstSignupWrapper;

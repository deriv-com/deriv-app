import React, { useState } from 'react';
import { Form, Formik } from 'formik';
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

    const initialValues = {
        country: '',
        citizenship: '',
        password: '',
    };

    return (
        <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit} validateOnChange>
            <Form>
                <FirstSignupScreens setStep={setStep} step={step} />
            </Form>
        </Formik>
    );
};

export default FirstSignupWrapper;

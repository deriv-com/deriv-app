import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import ReactModal from 'react-modal';
import { CUSTOM_STYLES } from '@/helpers';
import { signup } from '@/utils';
import { SignupScreens } from '../SignupScreens';

export type TSignupFormValues = {
    citizenship: string;
    country: string;
    password: string;
};

const SignupWrapper = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);

    const initialValues = {
        country: '',
        citizenship: '',
        password: '',
    };

    const handleSubmit = () => {
        // logic will be added later
        setIsOpen(false);
    };

    return (
        <ReactModal ariaHideApp={false} isOpen={isOpen} shouldCloseOnOverlayClick={false} style={CUSTOM_STYLES}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={signup}>
                <Form>
                    <SignupScreens setStep={setStep} step={step} />
                </Form>
            </Formik>
        </ReactModal>
    );
};

export default SignupWrapper;

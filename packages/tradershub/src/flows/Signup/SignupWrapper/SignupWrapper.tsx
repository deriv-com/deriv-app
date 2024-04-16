import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import ReactModal from 'react-modal';
import { CUSTOM_STYLES } from '@/helpers';
import { useQueryParams } from '@/hooks';
import { signup } from '@/utils';
import { SignupScreens } from '../SignupScreens';

export type TSignupFormValues = {
    citizenship: string;
    country: string;
    password: string;
};

const SignupWrapper = () => {
    const [step, setStep] = useState(1);
    const { openModal, isModalOpen } = useQueryParams();

    const initialValues = {
        country: '',
        citizenship: '',
        password: '',
    };

    const handleSubmit = () => {
        // logic will be added later
        openModal('RealAccountCreation');
    };

    const customStyles = { ...CUSTOM_STYLES, content: { ...CUSTOM_STYLES.content, overflow: 'unset' } };

    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={isModalOpen('Signup')}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
        >
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={signup}>
                <Form>
                    <SignupScreens setStep={setStep} step={step} />
                </Form>
            </Formik>
        </ReactModal>
    );
};

export default SignupWrapper;

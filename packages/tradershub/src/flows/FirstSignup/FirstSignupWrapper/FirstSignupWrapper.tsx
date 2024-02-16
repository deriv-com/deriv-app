import React, { Fragment, useEffect, useState } from 'react';
import { Form, Formik, FormikValues, useFormikContext } from 'formik';
import ReactModal from 'react-modal';
import { CUSTOM_STYLES } from '@/helpers';
import { useClientCountry } from '@deriv/api';
import { FirstSignupScreens } from '../FirstSignupScreens';

export type TFirstSignupFormValues = {
    citizenship: string;
    country: string;
    password: string;
};

const FirstSignupWrapper = () => {
    const [isOpen] = useState(true);
    const [step, setStep] = useState(1);
    const { data: clientCountry, isLoading: clientCountryLoading } = useClientCountry();
    // const { setFieldValue } = useFormikContext<TFirstSignupFormValues>();

    const initialValues = {
        country: clientCountry ?? '',
        citizenship: '',
        password: '',
    };

    const handleSubmit = () => {
        // will be added later
    };

    const handlerValidate = (values: FormikValues) => {
        // will be added later
    };

    // useEffect(() => {
    //     if (clientCountry) setFieldValue('country', clientCountry);
    //     // initialValues.country = clientCountry ?? '';
    //     // console.log('initialValues = ', initialValues);
    // }, [clientCountry, setFieldValue]);

    // console.log(
    //     'isLoading = ',
    //     isLoading,
    //     ', isSuccess = ',
    //     isSuccess,
    //     ', clientCountry = ',
    //     clientCountry,
    //     ', initValues = ',
    //     initialValues
    // );

    // if (isLoading) return null;

    return (
        <Fragment>
            <ReactModal ariaHideApp={false} isOpen={isOpen} shouldCloseOnOverlayClick={false} style={CUSTOM_STYLES}>
                <Formik
                    // enableReinitialize
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validate={handlerValidate}
                    validateOnChange
                >
                    <Form>
                        <FirstSignupScreens setStep={setStep} step={step} />
                    </Form>
                </Formik>
            </ReactModal>
            {/* <button onClick={() => show(<CitizenshipModal />)}>TEST</button> */}
        </Fragment>
    );
};

export default FirstSignupWrapper;

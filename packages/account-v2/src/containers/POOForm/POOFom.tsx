import React, { useEffect, useRef } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import { useSettings } from '@deriv/api-v2';
import { Accordion, Loader } from '@deriv-com/ui';
import { Timeline } from 'src/components/Timeline';
import { TPaymentMethod, TPaymentMethodData, TProofOfOwnershipFormValue } from 'src/types';
import { generatePOOInitialValues } from 'src/utils';

type TPOOFormProps = {
    paymentMethodData: TPaymentMethodData;
};

export const POOForm = ({ paymentMethodData }: TPOOFormProps) => {
    const { data: accountSettings, isLoading } = useSettings();
    const formRef = useRef<FormikProps<TProofOfOwnershipFormValue>>(null);
    const paymentMethods = Object.keys(paymentMethodData) as TPaymentMethod[];

    useEffect(() => {
        if (formRef.current) {
            formRef.current.resetForm();
        }
    }, [paymentMethods]);

    if (isLoading) {
        return <Loader isFullScreen />;
    }

    const initialFormValues = generatePOOInitialValues(paymentMethodData);

    return (
        <Formik
            enableReinitialize
            initialValues={initialFormValues}
            innerRef={formRef}
            onSubmit={() => {
                //TODO: Implement onSubmit
            }}
        >
            {({ dirty, isSubmitting, isValid }) => (
                <Form>
                    <Timeline className='pt-0 px-14 pb-16 m-12 w-full text-lg'>
                        {paymentMethods.map((type, index) => (
                            <Timeline.Item key={`${type}_${index}`}>
                                <Accordion title={paymentMethodData[type].paymentMethod} variant='bordered'>
                                    <div>POO item</div>
                                </Accordion>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </Form>
            )}
        </Formik>
    );
};

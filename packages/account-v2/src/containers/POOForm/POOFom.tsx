import React, { useEffect, useRef } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import { useSettings } from '@deriv/api-v2';
import { Accordion, Button, Divider, Loader } from '@deriv-com/ui';
import { Timeline } from 'src/components/Timeline';
import { TPaymentMethod, TPaymentMethodData, TProofOfOwnershipFormValue } from 'src/types';
import { generatePOOInitialValues } from 'src/utils';
import { PaymentMethodForm, PaymentMethodTitle } from '../PaymentMethods';

type TPOOFormProps = {
    paymentMethodData: TPaymentMethodData;
};

export const POOForm = ({ paymentMethodData }: TPOOFormProps) => {
    const { isLoading } = useSettings();
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
                <Form className='grid h-full'>
                    <Timeline className='pt-0 px-14 pb-16 m-12 w-full text-lg'>
                        {paymentMethods.map((type, index) => (
                            <Timeline.Item key={`${type}_${index}`}>
                                <Accordion
                                    title={<PaymentMethodTitle paymentMethod={paymentMethodData[type].paymentMethod} />}
                                    variant='bordered'
                                >
                                    <PaymentMethodForm paymentMethodDetail={paymentMethodData[type]} />
                                </Accordion>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                    <section className='flex gap-8 flex-col justify-end'>
                        <Divider />
                        <div className='flex gap-8 justify-end'>
                            <Button disabled={!isValid || isSubmitting || !dirty} rounded='sm' size='lg' type='submit'>
                                Submit
                            </Button>
                        </div>
                    </section>
                </Form>
            )}
        </Formik>
    );
};

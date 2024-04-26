import React from 'react';
import { useFormikContext } from 'formik';
import { Input } from '@deriv-com/ui';
import { TPaymentMethod, TPaymentMethodIdentifier, TPaymentMethodInfo, TProofOfOwnershipFormValue } from 'src/types';
import { formatIdentifier } from 'src/utils';
import { FileUploaderField } from '../POOForm/FileUploadField';
import { PaymentMethodInstructions } from './PaymentMethodInstructions';

type TPaymentMethodFieldProps = {
    paymentMethodDetail: TPaymentMethodInfo;
};

export const PaymentMethodField = ({ paymentMethodDetail }: TPaymentMethodFieldProps) => {
    const formik = useFormikContext<TProofOfOwnershipFormValue>();

    if (!formik) {
        throw new Error('PaymentMethodField must be used within a Formik component');
    }

    const { errors, setFieldValue, values } = formik;

    const paymentMethod = paymentMethodDetail.paymentMethod.toLowerCase() as TPaymentMethod;

    const handleBlur = (
        identifierType: TPaymentMethodIdentifier,
        paymentID: number,
        paymentMethodIdentifier?: string
    ) => {
        handleIdentifierChange(formatIdentifier(identifierType, paymentMethodIdentifier), paymentID);
    };

    const handleIdentifierChange = (paymentMethodIdentifier: string, paymentID: number) => {
        const selectedPaymentMethod = values[paymentMethod] || {};

        selectedPaymentMethod[paymentID] = {
            ...selectedPaymentMethod[paymentID],
            paymentMethodIdentifier,
        };

        setFieldValue(paymentMethod, selectedPaymentMethod);
    };

    return (
        <div className='flex flex-col gap-24'>
            <PaymentMethodInstructions paymentMethod={paymentMethod as TPaymentMethod} />
            <fieldset className='flex flex-col gap-24'>
                {paymentMethodDetail.items &&
                    paymentMethodDetail.items.map(item => {
                        const controlsToShow = [...Array(item.documents_required).keys()];
                        const paymentID = item.id as number;
                        const errorMessage = errors[paymentMethod]?.[paymentID]?.paymentMethodIdentifier ?? '';
                        return (
                            <div className='flex gap-8' key={`${paymentMethod}-${paymentID}`}>
                                <Input
                                    data-lpignore='true'
                                    error={Boolean(errorMessage)}
                                    label={paymentMethodDetail.inputLabel as string}
                                    message={errorMessage}
                                    onBlur={() =>
                                        handleBlur(
                                            paymentMethodDetail.identifier as TPaymentMethodIdentifier,
                                            paymentID,
                                            values[paymentMethod]?.[paymentID]?.paymentMethodIdentifier
                                        )
                                    }
                                    onChange={e => handleIdentifierChange(e.target.value, paymentID)}
                                    type='text'
                                    value={values[paymentMethod]?.[paymentID]?.paymentMethodIdentifier}
                                />
                                <section className='flex flex-col gap-16 w-full'>
                                    {controlsToShow.map((_, idx) => {
                                        return (
                                            <FileUploaderField
                                                key={`${item?.id}-${idx}`}
                                                methodId={paymentID}
                                                paymentMethod={paymentMethod}
                                                subIndex={idx}
                                            />
                                        );
                                    })}
                                </section>
                            </div>
                        );
                    })}
            </fieldset>
        </div>
    );
};

import React from 'react';
import { useFormikContext } from 'formik';
import { Input } from '@deriv-com/ui';
import { TPaymentMethod, TPaymentMethodIdentifier, TPaymentMethodInfo, TProofOfOwnershipFormValue } from 'src/types';
import { formatIdentifier } from 'src/utils';
import { FileUploaderField } from '../POOForm/FileUploadField';

type TPaymentMethodFieldProps = {
    identifier: TPaymentMethodIdentifier;
    inputLabel: string;
    paymentMethod: TPaymentMethod;
    paymentMethodDetailItem: Exclude<TPaymentMethodInfo['items'], undefined>[number];
};

export const PaymentMethodField = ({
    identifier,
    inputLabel,
    paymentMethod,
    paymentMethodDetailItem,
}: TPaymentMethodFieldProps) => {
    const formik = useFormikContext<TProofOfOwnershipFormValue>();

    if (!formik) {
        throw new Error('PaymentMethodField must be used within a Formik component');
    }

    const { errors, setFieldValue, values } = formik;

    const controlsToShow = [...Array(paymentMethodDetailItem.documents_required).keys()];
    const paymentID = paymentMethodDetailItem.id as number;
    const errorMessage = errors[paymentMethod]?.[paymentID]?.paymentMethodIdentifier ?? '';

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

        setFieldValue(paymentMethod, { ...selectedPaymentMethod });
    };

    return (
        <div className='flex gap-8' key={`${paymentMethod}-${paymentID}`}>
            <Input
                data-lpignore='true'
                error={Boolean(errorMessage)}
                label={inputLabel}
                message={errorMessage}
                onBlur={e => handleBlur(identifier, paymentID, e.target.value.trim())}
                onChange={e => handleIdentifierChange(e.target.value, paymentID)}
                type='text'
                value={values[paymentMethod]?.[paymentID]?.paymentMethodIdentifier}
            />
            <section className='flex flex-col gap-16 w-full'>
                {controlsToShow.map((_, idx) => {
                    return (
                        <FileUploaderField
                            key={`${paymentMethodDetailItem?.id}-${idx}`}
                            methodId={paymentID}
                            paymentMethod={paymentMethod}
                            subIndex={idx}
                        />
                    );
                })}
            </section>
        </div>
    );
};

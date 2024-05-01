import React, { ChangeEvent, MouseEvent, SyntheticEvent, useRef, useState } from 'react';
import clsx from 'clsx';
import { Field, FormikErrors, useFormikContext } from 'formik';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Button, Input } from '@deriv-com/ui';
import { ImageUtils } from '@deriv-com/utils';
import { TFile, TPaymentMethod, TProofOfOwnershipFormValue } from 'src/types';

type TFileUploadFieldProps = {
    methodId: number;
    paymentMethod: TPaymentMethod;
    subIndex: number;
};

export const FileUploaderField = ({ methodId, paymentMethod, subIndex }: TFileUploadFieldProps) => {
    const formik = useFormikContext<TProofOfOwnershipFormValue>();
    const { errors, setFieldError, setFieldValue, values } = formik;
    const [showBrowseButton, setShowBrowseButton] = useState(
        !values[paymentMethod]?.[methodId]?.files?.[subIndex]?.name
    );

    if (!formik) {
        throw new Error('FileUploaderField must be used within a Formik component');
    }

    // Create a reference to the hidden file input element
    const hiddenInputFieldRef = useRef<HTMLInputElement>(null);

    const preventEventBubble = (e: SyntheticEvent) => {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        preventEventBubble(event);
        // Check if files exist before proceeding
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }
        const fileToUpload = await ImageUtils.compressImageFile(event.target.files[0]);
        const paymentFileData = [...(values[paymentMethod]?.[methodId]?.files ?? [])];
        paymentFileData[subIndex] = fileToUpload as TFile;
        const selectedPaymentMethod = values?.[paymentMethod];
        if (!selectedPaymentMethod) {
            return;
        }
        selectedPaymentMethod[methodId] = {
            ...selectedPaymentMethod[methodId],
            files: paymentFileData ?? [],
        };
        await setFieldValue(paymentMethod, { ...selectedPaymentMethod });
        setShowBrowseButton(!fileToUpload);
    };

    const handleClick = (event: MouseEvent) => {
        preventEventBubble(event);
        hiddenInputFieldRef?.current?.click();
    };

    const updateError = () => {
        const paymentMethodError = errors?.[paymentMethod] ?? {};
        const paymentMethodFileError = (paymentMethodError?.[methodId]?.files as FormikErrors<TFile>[]) ?? {};

        delete paymentMethodFileError?.[subIndex];
        paymentMethodError[methodId] = {
            ...(paymentMethodError[methodId] ?? {}),
            files: paymentMethodFileError,
        };

        // [TODO] - Need to check the logic for removing the paymentMethodIdentifier
        if (Object.keys(paymentMethodError[methodId]?.files as object).length === 0) {
            delete paymentMethodError[methodId]?.paymentMethodIdentifier;
        }
        // @ts-expect-error Error is an array
        setFieldError(paymentMethod, { ...paymentMethodFileError });
    };

    const handleIconClick = async (e: React.MouseEvent) => {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        if (hiddenInputFieldRef.current && 'value' in hiddenInputFieldRef.current) {
            hiddenInputFieldRef.current.value = '';
        }
        const paymentFileData = values[paymentMethod]?.[methodId]?.files ?? [];
        const filteredFileData = paymentFileData.filter((_, i) => i !== subIndex);
        const selectedPaymentMethod = values?.[paymentMethod];
        if (!selectedPaymentMethod) {
            return;
        }
        selectedPaymentMethod[methodId] = {
            ...selectedPaymentMethod[methodId],
            files: filteredFileData,
        };
        await setFieldValue(paymentMethod, { ...selectedPaymentMethod });
        setShowBrowseButton(prevState => !prevState);
        updateError();
    };

    return (
        <Field name={paymentMethod}>
            {() => {
                const errorMessage = errors?.[paymentMethod]?.[methodId]?.files?.[subIndex];
                return (
                    <div className='flex gap-8'>
                        <input
                            accept='image/png, image/jpeg, image/jpg, application/pdf'
                            className='hidden'
                            name={paymentMethod}
                            onChange={handleChange}
                            ref={hiddenInputFieldRef}
                            type='file'
                        />
                        <Input
                            error={Boolean(errorMessage)}
                            isFullWidth
                            label='Choose a photo'
                            maxLength={255}
                            message={
                                errorMessage
                                    ? errorMessage?.toString()
                                    : 'Accepted formats: pdf, jpeg, jpg, and png. Max file size: 8MB'
                            }
                            name='cardImgName'
                            onClick={handleClick}
                            readOnly
                            rightPlaceholder={
                                <button
                                    className={clsx({ hidden: showBrowseButton })}
                                    onClick={handleIconClick}
                                    type='button'
                                >
                                    <StandaloneXmarkBoldIcon height={20} width={20} />
                                </button>
                            }
                            type='text'
                            value={values[paymentMethod]?.[methodId]?.files?.[subIndex]?.name ?? ''}
                        />
                        <Button onClick={handleClick} size='lg' type='button'>
                            Browse
                        </Button>
                    </div>
                );
            }}
        </Field>
    );
};

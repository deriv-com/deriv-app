import React from 'react';
import { Field, FieldProps, FormikErrors, useFormikContext } from 'formik';
import { TFile, compressImageFiles } from 'src/utils';
import { TPaymentMethod, TProofOfOwnershipFormValue } from 'src/types';
import { Button, Input } from '@deriv-com/ui';
import { StandaloneXmarkRegularIcon } from '@deriv/quill-icons';
import clsx from 'clsx';

type TFileUploadFieldProps = {
    methodId: number | string;
    paymentMethod: TPaymentMethod;
    subIndex: number | string;
};

export const FileUploaderField = ({ methodId, paymentMethod, subIndex }: TFileUploadFieldProps) => {
    const formik = useFormikContext<TProofOfOwnershipFormValue>();
    const { values, setFieldValue, errors } = formik;
    const [showBrowseButton, setShowBrowseButton] = React.useState(
        !values[paymentMethod]?.[methodId]?.files?.[subIndex as number]?.name
    );

    if (!formik) {
        throw new Error('FileUploaderField must be used within a Formik component');
    }

    // Create a reference to the hidden file input element
    const hiddenInputFieldRef = React.useRef<HTMLInputElement>(null);

    const handleChange = async (event: React.FormEvent<HTMLInputElement>) => {
        event.nativeEvent.preventDefault();
        event.nativeEvent.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        const fileToUpload = await compressImageFiles([event.target.files[0]]);
        const paymentFileData = [...(values[paymentMethod]?.[methodId]?.files ?? [])];
        paymentFileData[subIndex as number] = fileToUpload[0] as TFile;
        const selectedPaymentMethod = values?.[paymentMethod];
        if (!selectedPaymentMethod) {
            return;
        }
        selectedPaymentMethod[methodId] = {
            ...selectedPaymentMethod[methodId],
            files: paymentFileData ?? [],
        };
        await setFieldValue(paymentMethod, { ...selectedPaymentMethod });
        setShowBrowseButton(!fileToUpload[0]);
    };

    const handleClick = (e: React.MouseEvent) => {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        hiddenInputFieldRef?.current?.click();
    };

    const updateError = () => {
        const paymentMethodError = errors?.[paymentMethod] ?? {};
        const paymentMethodFileError = (paymentMethodError?.[methodId]?.files as FormikErrors<TFile>[]) ?? {};

        delete paymentMethodFileError?.[subIndex as number];
        paymentMethodError[methodId] = {
            ...(paymentMethodError[methodId] ?? {}),
            files: paymentMethodFileError,
        };

        if (Object.keys(paymentMethodError[methodId]?.files as object).length === 0) {
            delete paymentMethodError[methodId]?.paymentMethodIdentifier;
        }
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
            {({ field: { value }, form, meta: { error, touched } }: FieldProps<string>) => {
                const errorMessage = errors?.[paymentMethod]?.[methodId]?.files?.[subIndex as number];
                return (
                    <div>
                        <input
                            type='file'
                            accept='image/png, image/jpeg, image/jpg, application/pdf'
                            ref={hiddenInputFieldRef}
                            onChange={handleChange}
                            className='hidden-input'
                            name={paymentMethod}
                        />
                        <Input
                            name='cardImgName'
                            readOnly
                            label='Choose a photo'
                            maxLength={255}
                            message={
                                Boolean(errorMessage)
                                    ? errorMessage?.toString()
                                    : 'Accepted formats: pdf, jpeg, jpg, and png. Max file size: 8MB'
                            }
                            value={values[paymentMethod]?.[methodId]?.files?.[subIndex as number]?.name ?? ''}
                            type='text'
                            error={Boolean(errorMessage)}
                            rightPlaceholder={
                                <Button
                                    className={clsx({ hidden: showBrowseButton })}
                                    size='md'
                                    type='button'
                                    variant='ghost'
                                    color='white'
                                    onClick={handleIconClick}
                                >
                                    <StandaloneXmarkRegularIcon height={20} width={20} />
                                </Button>
                            }
                        />
                        <Button size='md' onClick={handleClick} type='button'>
                            Browse
                        </Button>
                    </div>
                );
            }}
        </Field>
    );
};

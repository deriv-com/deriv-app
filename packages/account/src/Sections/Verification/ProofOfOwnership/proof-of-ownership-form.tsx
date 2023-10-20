import React from 'react';
import classNames from 'classnames';
import { Form, Formik, FormikErrors, FormikProps } from 'formik';
import DocumentUploader from '@binary-com/binary-document-uploader';
import { Button } from '@deriv/components';
import {
    readFiles,
    WS,
    DOCUMENT_TYPE,
    isFormattedCardNumber,
    hasInvalidCharacters,
    validEmail,
    validPhone,
    validFile,
} from '@deriv/shared';
import { TCoreStores } from '@deriv/stores/types';
import { Localize, localize } from '@deriv/translations';
import FormFooter from '../../../Components/form-footer';
import FormBody from '../../../Components/form-body';
import FormSubHeader from '../../../Components/form-sub-header';
import FormBodySection from '../../../Components/form-body-section';
import Card from '../../../Containers/proof-of-ownership/card';
import { IDENTIFIER_TYPES, VALIDATIONS } from '../../../Constants/poo-identifier';
import {
    TPaymentMethod,
    TPaymentMethodIdentifier,
    TPaymentMethodInfo,
    TProofOfOwnershipData,
    TProofOfOwnershipFormValue,
} from '../../../Types';
import { PHONE_NUMBER_LENGTH } from 'Constants/personal-details';

type TProofOfOwnershipFormProps = {
    client_email: TCoreStores['client']['email'];
    grouped_payment_method_data: Partial<Record<TPaymentMethod, TPaymentMethodInfo>>;
    is_mobile: TCoreStores['ui']['is_mobile'];
    refreshNotifications: TCoreStores['notifications']['refreshNotifications'];
    updateAccountStatus: TCoreStores['client']['updateAccountStatus'];
};

type TProofOfOwnershipErrors = Partial<
    Record<TPaymentMethod, { payment_method_identifier?: string; files?: Array<string> }>
>;

//need to check types
// type TInitialValues = { data?: DeepPartial<TPaymentMethodUploadData>[][] };
// type TErrors = { data?: { payment_method_identifier?: string; files?: File[] }[] };

const ProofOfOwnershipForm = ({
    client_email,
    grouped_payment_method_data,
    is_mobile,
    refreshNotifications,
    updateAccountStatus,
}: TProofOfOwnershipFormProps) => {
    const grouped_payment_method_data_keys = Object.keys(grouped_payment_method_data) as Array<TPaymentMethod>;

    let initial_values = {};
    // const [form_state, setFormState] = React.useState({ is_btn_loading: false });
    const form_ref = React.useRef(null);

    const getScrollOffset = React.useCallback(
        (items_count = 0) => {
            if (is_mobile) return '200px';
            if (items_count <= 2) return '0px';
            return '80px';
        },
        [is_mobile]
    );

    const fileReadErrorMessage = (filename: string) => {
        return localize('Unable to read file {{name}}', { name: filename });
    };

    if (grouped_payment_method_data_keys) {
        const default_value = {
            documents_required: 0,
            id: 0,
            identifier_type: '',
            is_generic_pm: false,
            payment_method_identifier: '',
        };
        const form_value = grouped_payment_method_data_keys.reduce((acc, payment_method) => {
            const { documents_required, is_generic_pm } = grouped_payment_method_data[payment_method];
            acc[payment_method] = { ...default_value, documents_required, is_generic_pm };
            return acc;
        }, {});

        initial_values = { ...initial_values, ...form_value };
    }

    const isValidPaymentMethodIdentifier = (
        payment_method_identifier: string,
        identifier_type: TPaymentMethodIdentifier
    ) => {
        switch (identifier_type) {
            case IDENTIFIER_TYPES.CARD_NUMBER: {
                if (payment_method_identifier.length > 19) {
                    return isFormattedCardNumber(payment_method_identifier)
                        ? null
                        : localize('Enter your full card number');
                } else if (payment_method_identifier.length === 16) {
                    return !hasInvalidCharacters(payment_method_identifier)
                        ? null
                        : localize('Enter your full card number');
                }
                return null;
            }
            case IDENTIFIER_TYPES.EMAIL_ADDRESS: {
                return validEmail(payment_method_identifier) ? null : localize('Enter valid email address');
            }
            case IDENTIFIER_TYPES.MOBILE_NUMBER: {
                if (
                    payment_method_identifier.length >= PHONE_NUMBER_LENGTH.MIN &&
                    payment_method_identifier.length <= PHONE_NUMBER_LENGTH.MAX
                ) {
                    return validPhone(payment_method_identifier) ? null : localize('Enter valid phone number');
                }
                return null;
            }
            default: {
                return null;
            }
        }
    };

    const isValidFile = (file: File) => {
        if (!validFile(file)) {
            return localize("That file format isn't supported. Please upload .pdf, .png, .jpg, or .jpeg files only.");
        } else if (file?.size / 1024 > 8000) {
            return localize('That file is too big (only up to 8MB allowed). Please upload another file.');
        }
        return null;
    };

    const validateFields = (values: TProofOfOwnershipFormValue) => {
        let errors: FormikErrors<TProofOfOwnershipErrors> = {};
        let total_documents_uploaded = 0;
        let are_files_uploaded = false;

        if (!values) {
            return errors;
        }

        Object.keys(values).forEach(card_key => {
            const card_data = values[card_key as TPaymentMethod];
            console.log('Card data: ', card_data);
            const is_payment_method_identifier_provided =
                card_data.is_generic_pm || card_data.payment_method_identifier.trim()?.length > 0;
            total_documents_uploaded = card_data?.files?.length ?? 0;
            are_files_uploaded = total_documents_uploaded === card_data.documents_required;
            console.log('Status: ', total_documents_uploaded, card_data.documents_required);
            console.log('is_payment_method_identifier_provided: ', is_payment_method_identifier_provided, errors);
            if (is_payment_method_identifier_provided) {
                const verify_payment_method_identifier = isValidPaymentMethodIdentifier(
                    card_data.payment_method_identifier.trim(),
                    card_data.identifier_type
                );
                if (verify_payment_method_identifier) {
                    // errors[card_key as TPaymentMethod] = errors[card_key as TPaymentMethod] ?? {};
                    errors = {
                        ...errors,
                        [card_key as TPaymentMethod]: {
                            ...errors[card_key as TPaymentMethod],
                            payment_method_identifier: verify_payment_method_identifier,
                        },
                    };
                    // errors[card_key as TPaymentMethod].payment_method_identifier = verify_payment_method_identifier;
                } else {
                    delete errors[card_key]?.payment_method_identifier;
                }
            }
            console.log('Are files uploaded: ', are_files_uploaded, errors);
            if (are_files_uploaded) {
                card_data?.files?.forEach((file, i) => {
                    const verify_file = isValidFile(file);
                    if (verify_file) {
                        errors = {
                            ...errors,
                            [card_key as TPaymentMethod]: {
                                ...errors[card_key as TPaymentMethod],
                                files: { ...errors[card_key as TPaymentMethod]?.files, [i]: verify_file },
                            },
                        };
                        // errors[card_key].files[i] = verify_file;
                    } else {
                        delete errors[card_key]?.files[i];
                    }
                });
            } else {
                delete errors[card_key]?.files;
            }
        });
        return errors;
    };

    const updateErrors = async (index: number, item_index: number, sub_index: number) => {
        // let error_count = 0;
        // const errors: FormikErrors<TInitialValues> = {};
        // errors.data = [...(form_ref?.current?.errors?.data || [])];
        // if (typeof errors?.data[index] === 'object') {
        //     delete errors?.data?.[index]?.[item_index]?.files?.[sub_index];
        //     const has_other_errors = errors?.data[index]?.[item_index]?.files?.some(error => error !== null);
        //     if (!has_other_errors) {
        //         delete errors?.data[index]?.[item_index];
        //     }
        //     errors?.data?.forEach(e => {
        //         error_count += Object.keys(e || {}).length;
        //     });
        //     if (error_count === 0) {
        //         errors.data = [];
        //     }
        // }
        // await form_ref?.current?.setErrors(errors);
        // await form_ref?.current?.validateForm();
    };

    const handleFormSubmit = values => {
        console.log('data', values);
        // try {
        //     setFormState({ ...form_state, ...{ is_btn_loading: true } });
        //     const uploader = new DocumentUploader({ connection: WS.getSocket() });
        //     if (form_ref.current.errors.length > 0) {
        //         // Only upload if no errors and a file has been attached
        //         return;
        //     }
        //     Object.keys(form_values).forEach(card_key => {
        //         Object.keys(form_values[card_key]).forEach(async card_item_key => {
        //             const payment_method_details = form_values[card_key][card_item_key];
        //             if (payment_method_details.files.length > 0) {
        //                 const processed_files = await readFiles(payment_method_details.files, fileReadErrorMessage, {
        //                     documentType: DOCUMENT_TYPE.proof_of_ownership,
        //                     proof_of_ownership: {
        //                         details: {
        //                             email: client_email,
        //                             payment_identifier: payment_method_details.payment_method_identifier,
        //                         },
        //                         id: payment_method_details.id,
        //                     },
        //                 });
        //                 console.log('Payload: ', processed_files);
        //                 // processed_files.forEach(async (processed_file, sub_index) => {
        //                 //     const response = await uploader.upload(processed_file);
        //                 //     if (response.warning) {
        //                 //         if (response.warning.trim() === 'DuplicateUpload') {
        //                 //             let { errors: form_errors } = form_ref?.current;
        //                 //             if (!form_errors?.data) {
        //                 //                 form_errors = {};
        //                 //                 form_errors.data = [];
        //                 //                 form_errors.data[card_key] = {};
        //                 //             } else if (!form_errors.data?.[card_key]) {
        //                 //                 form_errors.data[card_key] = {};
        //                 //             }
        //                 //             form_errors.data[card_key][card_item_key] =
        //                 //                 form_errors?.data?.[card_key]?.[card_item_key] ?? {};
        //                 //             form_errors.data[card_key][card_item_key].files =
        //                 //                 form_errors?.data?.[card_key]?.[card_item_key]?.files ?? [];
        //                 //             form_errors.data[card_key][card_item_key].files[sub_index] = response.message; // Document already uploaded
        //                 //             await form_ref.current.setErrors(form_errors);
        //                 //             await form_ref.current.validateForm();
        //                 //             setFormState({ ...form_state, ...{ is_btn_loading: false } });
        //                 //         } else {
        //                 //             setFormState({ ...form_state, ...{ is_btn_loading: false } });
        //                 //         }
        //                 //     } else {
        //                 //         updateAccountStatus();
        //                 //         refreshNotifications();
        //                 //     }
        //                 // });
        //             }
        //         });
        //     });
        // } catch (err) {
        //     setFormState({ ...form_state, ...{ is_btn_loading: false } });
        // }
    };
    return (
        <Formik
            initialValues={initial_values}
            initialStatus={{ is_btn_loading: false }}
            validate={validateFields}
            innerRef={form_ref}
            onSubmit={handleFormSubmit}
        >
            {({ isValid, dirty, status }) => {
                return (
                    <Form
                        data-testid='dt_poo_form'
                        className='proof-of-ownership'
                        // onSubmit={e => {
                        //     e.nativeEvent.preventDefault();
                        //     e.nativeEvent.stopPropagation();
                        //     e.nativeEvent.stopImmediatePropagation();
                        //     handleSubmit(e);
                        // }}
                    >
                        <FormBody scroll_offset={getScrollOffset(grouped_payment_method_data_keys.length)}>
                            <FormSubHeader title={localize('Please upload the following document(s).')} />
                            <FormBodySection>
                                <fieldset>
                                    {grouped_payment_method_data_keys?.map((grouped_payment_method_data_key, index) => (
                                        <div
                                            className='proof-of-ownership__form-content'
                                            key={grouped_payment_method_data_key}
                                        >
                                            {grouped_payment_method_data_keys.length > 1 && (
                                                <div className='proof-of-ownership__progress'>
                                                    <div className='proof-of-ownership__progress-number'>
                                                        {index + 1}
                                                    </div>
                                                    {index !== grouped_payment_method_data_keys.length - 1 && (
                                                        <div className='proof-of-ownership__progress-bar' />
                                                    )}
                                                </div>
                                            )}

                                            <Card
                                                index={index}
                                                details={
                                                    grouped_payment_method_data[
                                                        grouped_payment_method_data_key
                                                    ] as TPaymentMethodInfo
                                                }
                                                updateErrors={updateErrors}
                                            />
                                        </div>
                                    ))}
                                </fieldset>
                            </FormBodySection>
                        </FormBody>
                        <FormFooter>
                            <Button
                                type='submit'
                                className={classNames('account-form__footer-btn')}
                                is_disabled={!dirty || !isValid}
                                data-testid={'submit-button'}
                                has_effect
                                large
                                primary
                                is_loading={status.is_btn_loading}
                            >
                                <Localize i18n_default_text='Submit' />
                            </Button>
                        </FormFooter>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default ProofOfOwnershipForm;

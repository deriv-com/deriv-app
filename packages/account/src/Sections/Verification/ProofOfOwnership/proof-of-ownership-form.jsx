import classNames from 'classnames';
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, useStateCallback } from '@deriv/components';
import { Formik } from 'formik';
import { localize } from '@deriv/translations';
import FormFooter from '../../../Components/form-footer';
import FormBody from '../../../Components/form-body';
import FormSubHeader from '../../../Components/form-sub-header';
import FormBodySection from '../../../Components/form-body-section';
import { isMobile, readFiles, WS, DOCUMENT_TYPE } from '@deriv/shared';
import Card from './card.jsx';
import DocumentUploader from '@binary-com/binary-document-uploader';
import { IDENTIFIER_TYPES, VALIDATIONS } from './constants/constants';

const getScrollOffset = (items_count = 0) => {
    if (isMobile()) return '200px';
    if (items_count <= 2) return '0px';
    return '80px';
};
const ProofOfOwnershipForm = ({
    client_email,
    grouped_payment_method_data,
    refreshNotifications,
    total_documents_required,
    updateAccountStatus,
}) => {
    const grouped_payment_method_data_keys = Object.keys(grouped_payment_method_data);
    const initial_values = {};
    const [is_submit_button_disabled, setIsSubmitButtonDisabled] = React.useState(true);
    const [form_state, setFormState] = useStateCallback({ should_show_form: true });
    const form_ref = useRef();
    const [document_upload_errors, setDocumentUploadErrors] = useState();
    useEffect(() => {
        setDocumentUploadErrors([]);
    }, []);
    const fileReadErrorMessage = filename => {
        return localize('Unable to read file {{name}}', { name: filename });
    };

    const validateFields = values => {
        const errors = {};
        errors.data = [...document_upload_errors];
        let total_documents_uploaded = 0;
        let has_errors = false;
        const cards = values?.data;
        Object.keys(cards)?.forEach?.(card_key => {
            const items = cards?.[card_key] ?? {};
            errors.data[card_key] = errors.data?.[card_key] ?? [];
            Object.keys(items)?.forEach?.(item_key => {
                errors.data[card_key][item_key] = errors.data?.[card_key]?.[item_key] ?? {};
                const payment_method = items?.[item_key];
                const payment_method_identifier = payment_method?.payment_method_identifier?.trim();
                const is_pm_identifier_provided =
                    payment_method?.is_generic_pm || payment_method_identifier?.length > 0;
                const is_credit_or_debit_card = payment_method?.identifier_type === IDENTIFIER_TYPES.card_number;
                total_documents_uploaded += payment_method?.files?.filter(Boolean)?.length ?? 0;
                payment_method?.files?.forEach((file, i) => {
                    errors.data[card_key][item_key].files = errors?.data?.[card_key]?.[item_key]?.files ?? [];
                    if (file?.type && !/(image|application)\/(jpe?g|pdf|png)$/.test(file?.type)) {
                        errors.data[card_key][item_key].files[i] = localize(
                            "That file format isn't supported. Please upload .pdf, .png, .jpg, or .jpeg files only."
                        );
                    }
                    if (file?.size / 1024 > 8000) {
                        errors.data[card_key][item_key].files[i] = localize(
                            'That file is too big (only up to 8MB allowed). Please upload another file.'
                        );
                    }
                    if (!is_pm_identifier_provided) {
                        errors.data[card_key][item_key].payment_method_identifier =
                            localize('Please complete this field.');
                    }
                });
                if (
                    (is_credit_or_debit_card &&
                        payment_method_identifier?.length !== 0 &&
                        (payment_method_identifier?.length !== 16 || payment_method_identifier?.length > 19) &&
                        !VALIDATIONS.is_formated_card_number(payment_method_identifier)) ||
                    (is_credit_or_debit_card &&
                        payment_method_identifier?.length === 16 &&
                        VALIDATIONS.has_invalid_characters(payment_method_identifier))
                ) {
                    errors.data[card_key][item_key].payment_method_identifier = localize('Enter your full card number');
                }
                has_errors =
                    has_errors ||
                    errors?.data?.[card_key]?.[item_key]?.payment_method_identifier?.trim?.()?.length > 0 ||
                    errors?.data?.[card_key]?.[item_key]?.files?.length > 0;
            });
        });
        setIsSubmitButtonDisabled(total_documents_required !== total_documents_uploaded || has_errors);
        return errors;
    };

    const updateErrors = (index, item_index, sub_index) => {
        let error_count = 0;
        const errors = {};
        errors.data = [...document_upload_errors];
        if (typeof errors.data[index] === 'object') {
            delete errors.data[index][item_index].files[sub_index];
            const has_other_errors = errors?.data[index]?.[item_index]?.files?.some(error => error !== null);
            if (!has_other_errors) {
                delete errors?.data[index]?.[item_index];
            }
            document_upload_errors.forEach(e => {
                error_count += Object.keys(e).length;
            });
            if (error_count === 0) {
                errors.data = [];
            }
        }
        setDocumentUploadErrors(errors?.data);
        setIsSubmitButtonDisabled(true);
    };
    const handleSubmit = () => {
        try {
            setFormState({ ...form_state, ...{ is_btn_loading: true } });
            const { data: formValues } = form_ref.current.values;
            const uploader = new DocumentUploader({ connection: WS.getSocket() });
            if (form_ref.current.errors.length > 0) {
                // Only upload if no errors and a file has been attached
                return;
            }
            Object.keys(formValues).forEach(card_key => {
                Object.keys(formValues[card_key]).forEach(async card_item_key => {
                    const payment_method_details = formValues[card_key][card_item_key];
                    if (payment_method_details.files.length > 0) {
                        const processed_files = await readFiles(payment_method_details.files, fileReadErrorMessage, {
                            documentType: DOCUMENT_TYPE.proof_of_ownership,
                            proof_of_ownership: {
                                details: {
                                    email: client_email,
                                    payment_identifier: payment_method_details.payment_method_identifier,
                                },
                                id: payment_method_details.id,
                            },
                        });
                        processed_files.forEach(async (processed_file, sub_index) => {
                            const response = await uploader.upload(processed_file);
                            if (response.warning) {
                                if (response.warning.trim() === 'DuplicateUpload') {
                                    form_ref.current.errors.data = document_upload_errors;
                                    const { data: form_errors } = form_ref?.current?.errors;
                                    if (typeof form_errors[card_key] !== 'object') {
                                        form_errors[card_key] = {};
                                    }
                                    form_errors[card_key][card_item_key] =
                                        form_errors?.[card_key]?.[card_item_key] ?? {};
                                    form_errors[card_key][card_item_key].files =
                                        form_errors?.[card_key]?.[card_item_key]?.files ?? [];
                                    form_errors[card_key][card_item_key].files[sub_index] = response.message; // Document already uploaded
                                    setDocumentUploadErrors(form_errors);
                                    form_ref.current.setErrors(form_errors);
                                    form_ref.current.validateForm();
                                    setFormState({ ...form_state, ...{ is_btn_loading: false } });
                                } else {
                                    setFormState({ ...form_state, ...{ is_btn_loading: false } });
                                }
                            } else {
                                updateAccountStatus();
                                refreshNotifications();
                            }
                        });
                    }
                });
            });
        } catch (err) {
            setFormState({ ...form_state, ...{ is_btn_loading: false } });
        }
    };
    return (
        <Formik initialValues={initial_values} validate={validateFields} innerRef={form_ref}>
            {({ values, errors, handleChange, handleBlur, setFieldValue, validateField }) => (
                <form
                    data-testid='dt_poo_form'
                    className='proof-of-ownership'
                    onSubmit={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }}
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
                                                <div className='proof-of-ownership__progress-number'>{index + 1}</div>
                                                {index !== grouped_payment_method_data_keys.length - 1 && (
                                                    <div className='proof-of-ownership__progress-bar' />
                                                )}
                                            </div>
                                        )}
                                        <Card
                                            error={errors?.data?.[index]}
                                            index={index}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            values={values}
                                            card={grouped_payment_method_data[grouped_payment_method_data_key]}
                                            setFieldValue={setFieldValue}
                                            validateField={validateField}
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
                            is_disabled={is_submit_button_disabled}
                            data-testid={'submit-button'}
                            has_effect
                            text={localize('Submit')}
                            large
                            primary
                            is_loading={form_state.is_btn_loading}
                            onClick={handleSubmit}
                        />
                    </FormFooter>
                </form>
            )}
        </Formik>
    );
};

ProofOfOwnershipForm.propTypes = {
    client_email: PropTypes.string,
    grouped_payment_method_data: PropTypes.object,
    refreshNotifications: PropTypes.func,
    total_documents_required: PropTypes.number,
    updateAccountStatus: PropTypes.func,
};

export default ProofOfOwnershipForm;

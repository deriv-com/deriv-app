import classNames from 'classnames';
import React, { useRef } from 'react';
import { Button, FormSubmitErrorMessage, useStateCallback } from '@deriv/components';
import { Formik } from 'formik';
import { localize } from '@deriv/translations';
import FormFooter from '../../../Components/form-footer';
import FormBody from '../../../Components/form-body';
import FormSubHeader from '../../../Components/form-sub-header';
import FormBodySection from '../../../Components/form-body-section';
import { isMobile, compressImageFiles, readFiles, WS } from '@deriv/shared';
import Card from './Card.jsx';
import DocumentUploader from '@binary-com/binary-document-uploader';

const getScrollOffset = (itemsCount = 0) => {
    if (isMobile()) return '200px';
    if (itemsCount <= 2) return '0px';
    return '80px';
};
const ProofOfOwnershipForm = ({ cards, updateAccountStatus }) => {
    const initValues = {};
    const [isDisabled, setIsDisabled] = React.useState(true);
    initValues.data = cards?.map(item => {
        return { id: item.id, files: [], identifier: item.payment_method_identifier };
    });
    const [form_state, setFormState] = useStateCallback({ should_show_form: true });
    const formRef = useRef();
    const fileReadErrorMessage = filename => {
        return localize('Unable to read file {{name}}', { name: filename });
    };
    const validateFields = values => {
        const errors = {};
        errors.data = [];
        let fileUploaded = false;
        values.data.map((element, index) => {
            element.files.forEach((file, i) => {
                fileUploaded = fileUploaded === true || file?.file !== null;
                if (file?.file?.type && !/(image|application)\/(jpe?g|pdf|png)$/.test(file?.file?.type)) {
                    errors.data[index] = {};
                    errors.data[index].files = [];
                    errors.data[index].files[i] = {
                        file: localize(
                            "That file format isn't supported. Please upload .pdf, .png, .jpg, or .jpeg files only."
                        ),
                    };
                }
                if (file?.file?.size / 1024 > 8000) {
                    errors.data[index] = {};
                    errors.data[index].files = [];
                    errors.data[index].files[i] = {
                        file: localize('That file is too big (only up to 8MB allowed). Please upload another file.'),
                    };
                }
            });
        });
        setIsDisabled(!fileUploaded || errors?.data?.length > 0);
        return errors;
    };
    const handleSubmit = async e => {
        try {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            const { data: formValues } = formRef.current.values;
            const uploader = new DocumentUploader({ connection: WS.getSocket() });
            const { get_settings, error } = await WS.authorized.storage.getSettings();
            if (error) {
                throw new Error(error);
            }
            if (formRef.current.errors.length > 0) {
                // Only upload if no errors and a file has been attached
                return;
            }
            setFormState({ ...form_state, ...{ is_btn_loading: true } });
            formValues.forEach(async values => {
                const files = values.files.flatMap(f => f.file).filter(f => f !== null);
                if (files.length > 0) {
                    const filesToProcess = await compressImageFiles(files);
                    const processedFiles = await readFiles(filesToProcess, fileReadErrorMessage);
                    if (typeof processedFiles === 'string') {
                        // eslint-disable-next-line no-console
                        console.warn(processedFiles);
                    }
                    processedFiles.forEach(async pF => {
                        const fileToSends = pF;
                        fileToSends.proof_of_ownership = {
                            details: {
                                email: get_settings.email,
                                identifier: values.identifier,
                            },
                            id: values.id,
                        };
                        fileToSends.documentType = 'proof_of_ownership';
                        const response = await uploader.upload(fileToSends);
                        if (response.warning) {
                            // eslint-disable-next-line no-console
                            console.warn(response);
                        } else {
                            updateAccountStatus();
                        }
                    });
                }
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.warn(err);
        } finally {
            setFormState({ ...form_state, ...{ is_btn_loading: false } });
        }
    };
    return (
        <Formik initialValues={initValues} validate={validateFields} innerRef={formRef}>
            {({ values, errors, handleChange, handleBlur, setFieldValue, validateField }) => (
                <form className='proof-of-ownership' onSubmit={handleSubmit}>
                    <FormBody scroll_offset={getScrollOffset(cards.length)}>
                        <FormSubHeader title={localize('Please upload the following document(s).')} />
                        <FormBodySection>
                            <fieldset>
                                {cards.map((card, index) => {
                                    return (
                                        <div className='proof-of-ownership__form-content' key={card.id}>
                                            <div className='proof-of-ownership__progress'>
                                                <div className='proof-of-ownership__progress-number'>{index + 1}</div>
                                                {index !== cards.length - 1 && (
                                                    <div className='proof-of-ownership__progress-bar' />
                                                )}
                                            </div>
                                            <Card
                                                error={errors?.data?.[index]}
                                                index={index}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                values={values}
                                                card={card}
                                                setFieldValue={setFieldValue}
                                                validateField={validateField}
                                            />
                                        </div>
                                    );
                                })}
                            </fieldset>
                        </FormBodySection>
                    </FormBody>
                    <FormFooter>
                        {status?.msg && <FormSubmitErrorMessage message={status?.msg} />}
                        <Button
                            type='submit'
                            className={classNames('account-form__footer-btn')}
                            is_disabled={isDisabled}
                            data-testid={'submit-button'}
                            has_effect
                            text={localize('Submit')}
                            large
                            primary
                            is_loading={form_state.is_btn_loading}
                        />
                    </FormFooter>
                </form>
            )}
        </Formik>
    );
};

export default ProofOfOwnershipForm;

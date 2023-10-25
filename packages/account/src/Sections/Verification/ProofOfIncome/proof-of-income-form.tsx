import React from 'react';
import { Field, Formik, Form, FormikErrors, FormikHelpers, FormikValues } from 'formik';
import { AccountStatusResponse, DocumentUploadRequest } from '@deriv/api-types';
import {
    Autocomplete,
    Button,
    DesktopWrapper,
    FormSubmitErrorMessage,
    MobileWrapper,
    SelectNative,
} from '@deriv/components';
import { useFileUploader } from '@deriv/hooks';
import { localize, Localize } from '@deriv/translations';
import { isEqualArray, WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import FilesDescription from 'Components/file-uploader-container/files-descriptions';
import FormBody from 'Components/form-body';
import FormFooter from 'Components/form-footer';
import FormSubHeader from 'Components/form-sub-header';
import { income_status_codes, poinc_documents_list } from 'Sections/Verification/ProofOfIncome/proof-of-income-utils';
import FileUploaderContainer from '../../../Components/file-uploader-container';
import { isServerError } from 'Helpers/utils';

type TProofOfIncomeForm = {
    onSubmit: (status: typeof income_status_codes[keyof typeof income_status_codes]) => void;
};

type TInitialValues = {
    document_type: DocumentUploadRequest['document_type'] | '';
};

const ProofOfIncomeForm = observer(({ onSubmit }: TProofOfIncomeForm) => {
    const [document_file, setDocumentFile] = React.useState<File[]>([]);
    const [file_selection_error, setFileSelectionError] = React.useState<string | null>(null);

    const { notifications, ui } = useStore();
    const { addNotificationMessageByKey, removeNotificationMessage, removeNotificationByKey } = notifications;
    const { is_mobile, is_desktop } = ui;

    const { upload } = useFileUploader();

    const initial_form_values: TInitialValues = {
        document_type: '',
    };

    const validateFields = (values: TInitialValues) => {
        const errors: FormikErrors<TInitialValues> = {};
        const { document_type } = values;

        if (!document_type || !poinc_documents_list.find(c => c.text === document_type)) {
            errors.document_type = localize('This field is required.');
        }

        return errors;
    };

    const onSubmitValues = async (
        values: TInitialValues,
        { setStatus, setSubmitting }: FormikHelpers<TInitialValues>
    ) => {
        setStatus({ msg: '' });
        const uploading_value = poinc_documents_list.find(doc => doc.text === values.document_type)?.value ?? '';

        if (uploading_value) {
            setSubmitting(true);
            try {
                const api_response = await upload(document_file, { document_type: uploading_value });
                if (api_response.warning) {
                    setStatus({ msg: api_response.message });
                } else {
                    const get_account_status_response: DeepRequired<AccountStatusResponse> =
                        await WS.authorized.getAccountStatus();

                    const { income, needs_verification } =
                        get_account_status_response.get_account_status.authentication;
                    const needs_poinc =
                        needs_verification.includes('income') && ['rejected', 'none'].includes(income?.status);
                    removeNotificationMessage({ key: 'needs_poinc' });
                    removeNotificationByKey({ key: 'needs_poinc' });
                    removeNotificationMessage({ key: 'poinc_upload_limited' });
                    removeNotificationByKey({ key: 'poinc_upload_limited' });
                    onSubmit(income?.status);
                    if (needs_poinc) {
                        addNotificationMessageByKey('needs_poinc');
                    }
                }
            } catch (error) {
                if (isServerError(error)) {
                    setStatus({ msg: error.message });
                }
            } finally {
                setSubmitting(false);
            }
        }
    };

    const files_descriptions = [
        <Localize key={1} i18n_default_text='The document must be up-to-date and signed by the issuance authority.' />,
        <Localize key={2} i18n_default_text='The document must contain a letterhead.' />,
        <Localize key={3} i18n_default_text='Invalid or incomplete documents shall be rejected.' />,
    ];
    const files_descriptions_title = (
        <Localize i18n_default_text='The document must be recent and include your name and address:' />
    );

    return (
        <Formik initialValues={initial_form_values} onSubmit={onSubmitValues} validate={validateFields}>
            {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                isValid,
                setFieldValue,
                setStatus,
                status,
                touched,
                values,
            }) => (
                <Form noValidate className='proof-of-income__form' onSubmit={handleSubmit}>
                    <FormBody scroll_offset={is_desktop ? '0' : '200px'}>
                        <fieldset className='proof-of-income__form-field'>
                            <FormSubHeader
                                title={localize('Select document')}
                                title_text_size={is_mobile ? 'xs' : 's'}
                            />
                            <Field name='document_type'>
                                {({ field }: FormikValues) => (
                                    <React.Fragment>
                                        <DesktopWrapper>
                                            <Autocomplete
                                                {...field}
                                                name='document_type'
                                                data-lpignore='true'
                                                autoComplete='off'
                                                type='text'
                                                list_height='36rem'
                                                placeholder={localize('Select your document*')}
                                                error={touched.document_type && errors.document_type}
                                                list_items={poinc_documents_list}
                                                value={values.document_type}
                                                onChange={handleChange}
                                                onItemSelection={({
                                                    value,
                                                    text,
                                                }: typeof poinc_documents_list[number]) => {
                                                    setFieldValue('document_type', value ? text : '', true);
                                                    setStatus({ msg: '' });
                                                }}
                                                required
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <SelectNative
                                                name='document_type'
                                                placeholder={localize('Select your document*')}
                                                label={localize('Select your document*')}
                                                value={values.document_type}
                                                list_items={poinc_documents_list}
                                                error={touched.document_type && errors.document_type}
                                                use_text={true}
                                                onChange={e => {
                                                    setFieldValue('document_type', e.target.value, true);
                                                    setStatus({ msg: '' });
                                                }}
                                                required
                                                hide_top_placeholder
                                            />
                                        </MobileWrapper>
                                    </React.Fragment>
                                )}
                            </Field>
                        </fieldset>
                        <div className='proof-of-income__form-field'>
                            <FormSubHeader
                                title={localize('Document submission')}
                                title_text_size={is_mobile ? 'xs' : 's'}
                            />
                            <FileUploaderContainer
                                onFileDrop={files => {
                                    setDocumentFile(prevFiles => {
                                        if (!isEqualArray(prevFiles, files)) setStatus({ msg: '' });
                                        return files;
                                    });
                                }}
                                onError={setFileSelectionError}
                                files_description={
                                    <FilesDescription
                                        descriptions={files_descriptions}
                                        is_mobile={is_mobile}
                                        title={files_descriptions_title}
                                    />
                                }
                            />
                        </div>
                    </FormBody>
                    <FormFooter>
                        {status?.msg && <FormSubmitErrorMessage message={status.msg} />}
                        <Button
                            className='account-form__footer-btn'
                            type='submit'
                            is_disabled={
                                isSubmitting ||
                                !isValid ||
                                document_file.length < 1 ||
                                !!file_selection_error ||
                                !!status.msg
                            }
                            is_loading={isSubmitting}
                            has_effect
                            text={localize('Save and submit')}
                            primary
                        />
                    </FormFooter>
                </Form>
            )}
        </Formik>
    );
});

export default ProofOfIncomeForm;

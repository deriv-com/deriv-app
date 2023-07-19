import React from 'react';
import { Field, Formik, FormikErrors, FormikHelpers, FormikValues } from 'formik';
import {
    Autocomplete,
    Button,
    DesktopWrapper,
    FormSubmitErrorMessage,
    MobileWrapper,
    SelectNative,
    Text,
    Timeline,
} from '@deriv/components';
import { AccountStatusResponse, DocumentUploadResponse } from '@deriv/api-types';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import FormBody from 'Components/form-body';
import FormFooter from 'Components/form-footer';
import FormSubHeader from 'Components/form-sub-header';
import PoincFileUploaderContainer from 'Components/poinc/file-uploader-container';
import { income_status_codes, poinc_documents_list } from 'Sections/Verification/ProofOfIncome/proof-of-income-utils';
import { TDocumentSettings } from 'Types';

type TUpload = {
    upload: () => Promise<DocumentUploadResponse>;
};

type TProofOfIncomeForm = {
    onSubmit: (status: typeof income_status_codes[keyof typeof income_status_codes]) => void;
};

type TInitialValues = {
    document_type: TDocumentSettings['documentType'] | '';
};

let file_uploader_ref: React.RefObject<TUpload>;

const ProofOfIncomeForm = observer(({ onSubmit }: TProofOfIncomeForm) => {
    const [document_file, setDocumentFile] = React.useState({ files: [], error_message: null });
    const [disabled_items, setDisabledItems] = React.useState([2]);
    const [uploading_document_type, setUploadingDocumentType] = React.useState('');

    const { notifications } = useStore();
    const { addNotificationMessageByKey, removeNotificationMessage, removeNotificationByKey } = notifications;

    const initial_form_values: TInitialValues = {
        document_type: '',
    };

    const validateFields = (values: TInitialValues) => {
        const errors: FormikErrors<TInitialValues> = {};
        const { document_type } = values;

        if (!document_type || !poinc_documents_list.find(c => c.text === document_type)) {
            errors.document_type = localize('This field is required.');
        }

        if (!errors.document_type) {
            setDisabledItems([]);
        } else if (!disabled_items.includes(2)) {
            setDisabledItems([2]);
        }

        return errors;
    };

    const onSubmitValues = (values: TInitialValues, { setStatus, setSubmitting }: FormikHelpers<TInitialValues>) => {
        const uploading_value = poinc_documents_list.find(doc => doc.text === values.document_type)?.value;
        setUploadingDocumentType(uploading_value ?? '');

        file_uploader_ref?.current
            ?.upload()
            .then(api_response => {
                if (api_response.warning) {
                    setStatus({ msg: api_response.message });
                } else {
                    WS.authorized.getAccountStatus().then((response: DeepRequired<AccountStatusResponse>) => {
                        const { income, needs_verification } = response.get_account_status.authentication;
                        const needs_poinc =
                            needs_verification.includes('income') && ['rejected', 'none'].includes(income?.status);
                        removeNotificationMessage({ key: 'authenticate' });
                        removeNotificationByKey({ key: 'authenticate' });
                        removeNotificationMessage({ key: 'needs_poinc' });
                        removeNotificationByKey({ key: 'needs_poinc' });
                        removeNotificationMessage({ key: 'poinc_upload_limited' });
                        removeNotificationByKey({ key: 'poinc_upload_limited' });
                        onSubmit(income?.status);
                        if (needs_poinc) {
                            addNotificationMessageByKey('needs_poinc');
                        }
                    });
                }
            })
            .catch((error: Error) => {
                if (error?.message) {
                    setStatus({ msg: error.message });
                }
            })
            .then(() => {
                setSubmitting(false);
            });
    };

    return (
        <Formik initialValues={initial_form_values} onSubmit={onSubmitValues} validate={validateFields}>
            {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                setStatus,
                status,
                touched,
                values,
            }) => (
                <form noValidate className='account-poinc-form' onSubmit={handleSubmit}>
                    <FormBody scroll_offset={isDesktop() ? '0' : '200px'}>
                        <Timeline disabled_items={disabled_items} className='account-poinc-form__timeline-container'>
                            <Timeline.Item>
                                <fieldset className='account-poinc-form__fieldset'>
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
                                                        placeholder={localize('Please select a document to upload*')}
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
                                                        placeholder={localize('Please select a document to upload*')}
                                                        label={localize('Please select a document to upload*')}
                                                        value={values.document_type}
                                                        list_items={poinc_documents_list}
                                                        error={touched.document_type ? errors.document_type : undefined}
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
                            </Timeline.Item>
                            <Timeline.Item>
                                <div className='account-poinc-form__upload-field'>
                                    <div className='account-poinc-form__notes-container'>
                                        <FormSubHeader title={localize('Please note:')} />
                                        <div className='account__file-uploader-box account__file-uploader-box-dashboard'>
                                            <Text size='xs' line_height='s' color='less-prominent'>
                                                <Localize i18n_default_text='The document must be up-to-date and signed by the issuance authority' />
                                            </Text>
                                            <Text size='xs' line_height='s' color='less-prominent'>
                                                <Localize i18n_default_text='The document must contain a letterhead' />
                                            </Text>
                                            <Text size='xs' line_height='s' color='less-prominent'>
                                                <Localize i18n_default_text='Invalid or incomplete documents shall be rejected' />
                                            </Text>
                                        </div>
                                    </div>
                                    <PoincFileUploaderContainer
                                        onRef={ref => (file_uploader_ref = ref)}
                                        onFileDrop={df => {
                                            setDocumentFile({
                                                files: df.files,
                                                error_message: df.error_message,
                                            });
                                            setStatus({ msg: '' });
                                        }}
                                        getSocket={WS.getSocket}
                                        document_type={uploading_document_type}
                                    />
                                </div>
                            </Timeline.Item>
                        </Timeline>
                    </FormBody>
                    <FormFooter className='account-form__footer-poinc'>
                        {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                        <Button
                            className='account-form__footer-btn'
                            type='submit'
                            is_disabled={
                                isSubmitting ||
                                !!(!values.document_type || errors.document_type) ||
                                document_file.files?.length < 1 ||
                                !!document_file.error_message ||
                                !!status.msg
                            }
                            is_loading={isSubmitting}
                            has_effect
                            text={localize('Save and submit')}
                            primary
                        />
                    </FormFooter>
                </form>
            )}
        </Formik>
    );
});

export default ProofOfIncomeForm;

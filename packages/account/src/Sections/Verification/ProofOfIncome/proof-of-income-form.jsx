import React from 'react';
import PropTypes from 'prop-types';
import {
    Autocomplete,
    Loading,
    Button,
    // Input,
    DesktopWrapper,
    MobileWrapper,
    SelectNative,
    FormSubmitErrorMessage,
    // Text,
    Timeline,
    // useStateCallback,
} from '@deriv/components';
import { Formik, Field } from 'formik';
import { localize /* Localize */ } from '@deriv/translations';
import {
    /* isMobile, validAddress, validPostCode, validLetterSymbol, validLength, */ getLocation,
    WS,
} from '@deriv/shared';
import { connect } from 'Stores/connect';
import FormFooter from 'Components/form-footer';
// import FormBody from 'Components/form-body';
import LoadErrorMessage from 'Components/load-error-message';
// import LeaveConfirm from 'Components/leave-confirm';
import FileUploaderContainer from 'Components/file-uploader-container';

let file_uploader_ref = null;

const ProofOfIncomeForm = ({
    addNotificationByKey,
    fetchPoIncDocumentsList,
    removeNotificationByKey,
    removeNotificationMessage,
    poinc_documents_list,
    onSubmit,
}) => {
    const [document_file, setDocumentFile] = React.useState({ files: [], error_message: null });
    const [is_loading, setIsLoading] = React.useState(true);
    const [api_initial_load_error, setAPIInitialLoadError] = React.useState(null);

    React.useEffect(() => {
        fetchPoIncDocumentsList().then(() => {
            setIsLoading(false);
        });
    }, [fetchPoIncDocumentsList]);

    const initial_form_values = {
        document_input: '',
    };

    const validateFields = values => {
        const errors = {};
        const { document_input } = values;

        if (!document_input) {
            errors.document_input = localize('This field is required.');
        } else if (!poinc_documents_list.find(c => c.text === document_input)) {
            errors.document_input = localize('This field is required.');
        }

        return errors;
    };

    // Settings update is handled here
    const onSubmitValues = (values, { setStatus, setSubmitting }) => {
        setStatus({ msg: '' });
        const settings_values = { ...values };

        if (values.document_input && poinc_documents_list.length) {
            settings_values.document_input = getLocation(poinc_documents_list, values.document_input, 'value') || '';
        }

        WS.setSettings(settings_values).then(data => {
            if (data.error) {
                setStatus({ msg: data.error.message });
            } else {
                // force request to update settings cache since settings have been updated
                WS.authorized.storage
                    .getSettings()
                    .then(({ error /* get_settings */ }) => {
                        if (error) {
                            setAPIInitialLoadError(error.message);
                            return;
                        }

                        setIsLoading(false);
                    })
                    .then(() => {
                        // upload files
                        file_uploader_ref?.current
                            .upload()
                            .then(api_response => {
                                if (api_response.warning) {
                                    setStatus({ msg: api_response.message });
                                } else {
                                    WS.authorized.storage.getAccountStatus().then(({ error, get_account_status }) => {
                                        if (error) {
                                            setAPIInitialLoadError(error.message);
                                            return;
                                        }
                                        const { proof_of_income, needs_verification } =
                                            get_account_status.authentication;
                                        const has_poinc = !(proof_of_income && proof_of_income.status === 'none');

                                        const needs_poinc =
                                            needs_verification.length && needs_verification.includes('proof_of_income');
                                        onSubmit({ has_poinc });
                                        removeNotificationMessage({ key: 'authenticate' });
                                        removeNotificationByKey({ key: 'authenticate' });
                                        if (needs_poinc) {
                                            addNotificationByKey('needs_poi');
                                        }
                                    });
                                }
                            })
                            .catch(error => {
                                setStatus({ msg: error.message });
                            })
                            .then(() => {
                                setSubmitting(false);
                            });
                    });
            }
        });
    };

    if (api_initial_load_error) {
        return <LoadErrorMessage error_message={api_initial_load_error} />;
    }

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;

    return (
        <Formik initialValues={initial_form_values} onSubmit={onSubmitValues} validate={validateFields}>
            {({ values, errors, status, touched, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
                <>
                    <Timeline>
                        <Timeline.Item>
                            {/* <fieldset className='account-form__fieldset'> */}
                            <fieldset>
                                <Field name='document_input'>
                                    {({ field }) => (
                                        <React.Fragment>
                                            <DesktopWrapper>
                                                <Autocomplete
                                                    {...field}
                                                    name='document_input'
                                                    data-lpignore='true'
                                                    autoComplete='off'
                                                    type='text'
                                                    list_height='36rem'
                                                    placeholder={localize(
                                                        'Please select the document you wish to upload*'
                                                    )}
                                                    error={touched.document_input && errors.document_input}
                                                    list_items={poinc_documents_list}
                                                    value={values.document_input}
                                                    onChange={handleChange}
                                                    onItemSelection={({ value, text }) => {
                                                        setFieldValue('document_input', value ? text : '', true);
                                                    }}
                                                    required
                                                />
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <SelectNative
                                                    // {...field}
                                                    name='document_input'
                                                    placeholder={localize(
                                                        'Please select the document you wish to upload*'
                                                    )}
                                                    value={values.document_input}
                                                    list_items={poinc_documents_list}
                                                    error={touched.document_input && errors.document_input}
                                                    use_text={true}
                                                    onChange={e => {
                                                        setFieldValue('document_input', e.target.value, true);
                                                    }}
                                                    required
                                                />
                                            </MobileWrapper>
                                        </React.Fragment>
                                    )}
                                </Field>
                            </fieldset>
                        </Timeline.Item>
                        <Timeline.Item>
                            <FileUploaderContainer
                                onRef={ref => (file_uploader_ref = ref)}
                                onFileDrop={df =>
                                    setDocumentFile({
                                        files: df.files,
                                        error_message: df.error_message,
                                    })
                                }
                                getSocket={WS.getSocket}
                            />
                        </Timeline.Item>
                    </Timeline>
                    {/* <FormFooter className='account-form__footer-poa'> */}
                    <FormFooter>
                        {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                        <Button
                            className='account-form__footer-btn'
                            type='submit'
                            is_disabled={
                                isSubmitting ||
                                !!(!values.document_input || errors.document_input) ||
                                (document_file.files && document_file.files.length < 1) ||
                                !!document_file.error_message
                            }
                            has_effect
                            text={localize('Save and submit')}
                            primary
                        />
                    </FormFooter>
                </>
            )}
        </Formik>
    );
};

ProofOfIncomeForm.propTypes = {
    addNotificationByKey: PropTypes.func,
    fetchPoIncDocumentsList: PropTypes.func,
    onSubmit: PropTypes.func,
    removeNotificationByKey: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    poinc_documents_list: PropTypes.array,
};

export default connect(({ client, notifications }) => ({
    addNotificationByKey: notifications.addNotificationMessageByKey,
    removeNotificationMessage: notifications.removeNotificationMessage,
    removeNotificationByKey: notifications.removeNotificationByKey,
    poinc_documents_list: client.poinc_documents_list,
    fetchPoIncDocumentsList: client.fetchPoIncDocumentsList,
}))(ProofOfIncomeForm);

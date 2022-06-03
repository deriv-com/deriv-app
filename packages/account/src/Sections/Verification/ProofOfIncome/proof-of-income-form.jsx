import React from 'react';
import PropTypes from 'prop-types';
import {
    Autocomplete,
    Button,
    DesktopWrapper,
    MobileWrapper,
    SelectNative,
    FormSubmitErrorMessage,
    Timeline,
} from '@deriv/components';
import { Formik, Field } from 'formik';
import { localize } from '@deriv/translations';
import { WS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import FormFooter from 'Components/form-footer';
import LoadErrorMessage from 'Components/load-error-message';
import { PoincFileUploaderContainer } from 'Components/file-uploader-container';

let file_uploader_ref = null;

const ProofOfIncomeForm = ({
    addNotificationByKey,
    removeNotificationByKey,
    removeNotificationMessage,
    poinc_documents_list,
    onSubmit,
}) => {
    const [document_file, setDocumentFile] = React.useState({ files: [], error_message: null });
    const [inactive_items, setInactiveItems] = React.useState([2]);
    const [api_initial_load_error, setAPIInitialLoadError] = React.useState(null);

    const initial_form_values = {
        document_input: '',
    };

    const validateFields = values => {
        const errors = {};
        const { document_input } = values;

        if (!document_input) {
            setInactiveItems([2]);
            errors.document_input = localize('This field is required.');
        } else if (!poinc_documents_list.find(c => c.text === document_input)) {
            setInactiveItems([2]);
            errors.document_input = localize('This field is required.');
        }

        if (!errors.document_input) {
            setInactiveItems([]);
        }

        return errors;
    };

    // Settings update is handled here
    const onSubmitValues = (values, { setStatus, setSubmitting }) => {
        const document_type_value = poinc_documents_list.find(doc => doc.text === values.document_input)?.value;
        delete values.document_input;
        values.document_type = document_type_value;

        setStatus({ msg: '' });
        WS.setSettings(values).then(data => {
            if (!data.error) {
                setStatus({ msg: data.error.message });
                setSubmitting(false);
            } else {
                // force request to update settings cache since settings have been updated
                WS.authorized.storage
                    .getSettings()
                    .then(({ error }) => {
                        if (error) {
                            setAPIInitialLoadError(error.message);
                        }
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
                                        const { income, needs_verification } = get_account_status.authentication;
                                        const needs_poinc =
                                            needs_verification.includes('income') &&
                                            ['rejected', 'none'].includes(income?.status);
                                        removeNotificationMessage({ key: 'authenticate' });
                                        removeNotificationByKey({ key: 'authenticate' });
                                        removeNotificationMessage({ key: 'needs_poinc' });
                                        removeNotificationByKey({ key: 'needs_poinc' });
                                        onSubmit();
                                        if (needs_poinc) {
                                            addNotificationByKey('needs_poinc');
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

    return (
        <Formik initialValues={initial_form_values} onSubmit={onSubmitValues} validate={validateFields}>
            {({ values, errors, status, touched, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
                <form noValidate className='account-poinc-form' onSubmit={handleSubmit}>
                    <Timeline inactive_items={inactive_items}>
                        <Timeline.Item>
                            <fieldset className='account-poinc-form__fieldset'>
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
                            <div className='account-poinc-form__upload-field'>
                                <PoincFileUploaderContainer
                                    onRef={ref => (file_uploader_ref = ref)}
                                    onFileDrop={df =>
                                        setDocumentFile({
                                            files: df.files,
                                            error_message: df.error_message,
                                        })
                                    }
                                    getSocket={WS.getSocket}
                                />
                            </div>
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
};

ProofOfIncomeForm.propTypes = {
    addNotificationByKey: PropTypes.func,
    onSubmit: PropTypes.func,
    removeNotificationByKey: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    poinc_documents_list: PropTypes.array,
};

export default connect(({ notifications }) => ({
    addNotificationByKey: notifications.addNotificationMessageByKey,
    removeNotificationMessage: notifications.removeNotificationMessage,
    removeNotificationByKey: notifications.removeNotificationByKey,
}))(ProofOfIncomeForm);

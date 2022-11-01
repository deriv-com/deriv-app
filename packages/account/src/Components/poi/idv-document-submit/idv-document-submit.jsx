import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Autocomplete, Button, DesktopWrapper, Input, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { Formik, Field } from 'formik';
import { localize, Localize } from '@deriv/translations';
import { formatInput, WS } from '@deriv/shared';
import FormFooter from 'Components/form-footer';
import { getDocumentData, getRegex } from './utils';
import BackButtonIcon from 'Assets/ic-poi-back-btn.svg';
import DocumentSubmitLogo from 'Assets/ic-document-submit-icon.svg';

const IdvDocumentSubmit = ({ handleBack, handleViewComplete, selected_country, is_from_external }) => {
    const [document_list, setDocumentList] = React.useState([]);
    const [document_image, setDocumentImage] = React.useState(null);
    const [is_input_disable, setInputDisable] = React.useState(true);
    const [is_doc_selected, setDocSelected] = React.useState(false);
    const document_data = selected_country.identity.services.idv.documents_supported;
    const {
        value: country_code,
        identity: {
            services: {
                idv: { has_visual_sample },
            },
        },
    } = selected_country;

    React.useEffect(() => {
        // NOTE: This is a temporary filter. Remove after backend handles this from their side
        const document_types = Object.keys(document_data);
        const filtered_documents = ['gh', 'ng'].includes(country_code)
            ? document_types.filter(d => d !== 'voter_id')
            : document_types;

        setDocumentList(
            filtered_documents.map(key => {
                const { display_name, format } = document_data[key];
                const { new_display_name, example_format, sample_image } = getDocumentData(country_code, key) || {};

                return {
                    id: key,
                    text: new_display_name || display_name,
                    value: format,
                    sample_image,
                    example_format,
                };
            })
        );
    }, [country_code, document_data]);

    const resetDocumentItemSelected = setFieldValue => {
        setFieldValue(
            'document_type',
            {
                id: '',
                text: '',
                value: '',
                example_format: '',
                sample_image: '',
            },
            true
        );
        setDocumentImage('');
    };

    const initial_form_values = {
        document_type: '',
        document_number: '',
    };

    const getDocument = text => {
        return document_list.find(d => d.text === text);
    };

    const getExampleFormat = example_format => {
        return example_format ? localize('Example: ') + example_format : '';
    };

    const validateFields = values => {
        const errors = {};
        const { document_type, document_number } = values;

        if (!document_type || !document_type.text || !document_type.value) {
            errors.document_type = localize('Please select a document type.');
        } else {
            setInputDisable(false);
        }

        if (!document_number) {
            errors.document_number =
                localize('Please enter your document number. ') + getExampleFormat(document_type.example_format);
        } else {
            const format_regex = getRegex(document_type.value);
            if (!format_regex.test(document_number)) {
                errors.document_number =
                    localize('Please enter the correct format. ') + getExampleFormat(document_type.example_format);
            }
        }

        return errors;
    };

    const submitHandler = (values, { setSubmitting, setErrors }) => {
        setSubmitting(true);
        const { document_number, document_type } = values;
        const submit_data = {
            identity_verification_document_add: 1,
            document_number,
            document_type: document_type.id,
            issuing_country: country_code,
        };

        WS.send(submit_data).then(response => {
            setSubmitting(false);
            if (response.error) {
                setErrors({ error_message: response.error.message });
                return;
            }
            handleViewComplete();
        });
    };

    return (
        <Formik initialValues={initial_form_values} validate={validateFields} onSubmit={submitHandler}>
            {({
                dirty,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                isValid,
                setFieldValue,
                touched,
                values,
            }) => (
                <div className='proof-of-identity__container'>
                    <DocumentSubmitLogo className='icon' />
                    <Text className='proof-of-identity btm-spacer' align='center' weight='bold'>
                        {localize('Verify your identity')}
                    </Text>
                    <Text className='proof-of-identity__text btm-spacer' size='xs'>
                        {localize('Please select the document type and enter the ID number.')}
                    </Text>
                    <div className='proof-of-identity__inner-container btm-spacer'>
                        <div className='proof-of-identity__fieldset-container'>
                            <fieldset className='proof-of-identity__fieldset'>
                                <Field name='document'>
                                    {({ field }) => (
                                        <React.Fragment>
                                            <DesktopWrapper>
                                                <div className='document-dropdown'>
                                                    <Autocomplete
                                                        {...field}
                                                        name='document_type'
                                                        data-lpignore='true'
                                                        error={touched.document_type && errors.document_type}
                                                        autoComplete='off'
                                                        type='text'
                                                        label={localize('Choose the document type')}
                                                        list_items={document_list}
                                                        value={values.document_type.text}
                                                        onBlur={e => {
                                                            handleBlur(e);
                                                            if (!getDocument(e.target.value)) {
                                                                resetDocumentItemSelected(setFieldValue);
                                                            }
                                                        }}
                                                        onChange={handleChange}
                                                        onItemSelection={item => {
                                                            if (item.text === 'No results found' || !item.text) {
                                                                setDocSelected(false);
                                                                resetDocumentItemSelected(setFieldValue);
                                                            } else {
                                                                setFieldValue('document_type', item, true);
                                                                setDocSelected(true);
                                                                if (has_visual_sample) {
                                                                    setDocumentImage(item.sample_image || '');
                                                                }
                                                            }
                                                        }}
                                                        required
                                                    />
                                                </div>
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <SelectNative
                                                    {...field}
                                                    name='document_type'
                                                    error={touched.document_type && errors.document_type}
                                                    label={localize('Choose the document type')}
                                                    placeholder={localize('Please select')}
                                                    list_items={document_list}
                                                    value={values.document_type.text}
                                                    onChange={e => {
                                                        handleChange(e);
                                                        const selected_document = getDocument(e.target.value);
                                                        if (selected_document) {
                                                            setDocSelected(true);
                                                            setFieldValue('document_type', selected_document, true);
                                                            if (has_visual_sample) {
                                                                setDocumentImage(selected_document.sample_image);
                                                            }
                                                        }
                                                    }}
                                                    use_text={true}
                                                    required
                                                />
                                            </MobileWrapper>
                                        </React.Fragment>
                                    )}
                                </Field>
                            </fieldset>
                            <fieldset className='proof-of-identity__fieldset-input'>
                                <Field name='document_number'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            name='document_number'
                                            bottom_label={
                                                values.document_type &&
                                                getExampleFormat(values.document_type.example_format)
                                            }
                                            disabled={is_input_disable}
                                            error={
                                                (touched.document_number && errors.document_number) ||
                                                errors.error_message
                                            }
                                            autoComplete='off'
                                            placeholder='Enter your document number'
                                            value={values.document_number}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            onKeyUp={e => {
                                                const { example_format } = values.document_type;
                                                const current_input = example_format.includes('-')
                                                    ? formatInput(example_format, current_input || e.target.value, '-')
                                                    : e.target.value;
                                                setFieldValue('document_number', current_input, true);
                                                validateFields(values);
                                            }}
                                            required
                                        />
                                    )}
                                </Field>
                            </fieldset>
                        </div>
                        {document_image && (
                            <div
                                className={classNames('proof-of-identity__sample-container', {
                                    'proof-of-identity__sample-container-external': is_from_external,
                                })}
                            >
                                <Text size='xxs' weight='bold'>
                                    {localize('Sample:')}
                                </Text>
                                <div className='proof-of-identity__image-container'>
                                    <img
                                        className='proof-of-identity__image'
                                        src={document_image}
                                        alt='document sample image'
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    {is_doc_selected && (
                        <Text
                            className={classNames('proof-of-identity__text btm-spacer', {
                                'top-spacer': is_from_external,
                            })}
                            align='center'
                            size='xs'
                        >
                            <Localize i18n_default_text='Please ensure all your personal details are the same as in your chosen document. If you wish to update your personal details, go to account settings.' />
                        </Text>
                    )}
                    <FormFooter className='proof-of-identity__footer'>
                        <Button className='back-btn' onClick={handleBack} type='button' has_effect large secondary>
                            <BackButtonIcon className='back-btn-icon' /> {localize('Go Back')}
                        </Button>
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            onClick={handleSubmit}
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid}
                            text={localize('Verify')}
                            large
                            primary
                        />
                    </FormFooter>
                </div>
            )}
        </Formik>
    );
};

IdvDocumentSubmit.propTypes = {
    handleBack: PropTypes.func,
    handleViewComplete: PropTypes.func,
    is_from_external: PropTypes.bool,
    selected_country: PropTypes.object,
};

export default IdvDocumentSubmit;

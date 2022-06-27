import { Formik, Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { localize, Localize } from '@deriv/translations';
import { Autocomplete, AutoHeightWrapper, DesktopWrapper, Div100vhContainer, FormSubmitButton, Input, MobileWrapper, Modal, SelectNative, Text, ThemedScrollbars } from '@deriv/components';
import { isDesktop, formatInput, isMobile } from '@deriv/shared';
import { getDocumentData, getRegex } from '../idv-document-submit/utils';
import DocumentSubmitLogo from '../../../Assets/ic-document-submit-icon.svg';

export const ProofOfIdentityFormOnSignup = ({ getCurrentStep, goToPreviousStep, goToNextStep, onCancel, onSave, onSubmit, value, residence_list, citizen, }) => {
    const [document_list, setDocumentList] = React.useState([]);
    const [document_image, setDocumentImage] = React.useState(null);
    const [is_input_disable, setInputDisable] = React.useState(true);
    const [is_doc_selected, setDocSelected] = React.useState(false);

    const selected_country = residence_list.find(residence => residence.value === citizen);
    const document_data = selected_country.identity.services.idv.documents_supported;
    const is_from_external = true;
    const {
        value: country_code,
        identity: {
            services: {
                idv: { has_visual_sample },
            },
        },
    } = selected_country;

    React.useEffect(() => {
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


    React.useEffect(() => {
        if (value?.document_type) {
            setInputDisable(false);
        }
    }, [])
    const initial_form_values = {
        document_type: '',
        document_number: '',
    }
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

    const getDocument = text => {
        return document_list.find(d => d.text === text);
    };

    const getExampleFormat = example_format => {
        return example_format ? localize('Example: ') + example_format : '';
    };

    const handleCancel = values => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };
    return (
        <Formik
            initialValues={value ? value : initial_form_values}
            validate={validateFields}
            onSubmit={(values, actions) => {
                values.country_code = country_code;
                onSubmit(getCurrentStep() - 1, values, actions.setSubmitting, goToNextStep);
            }}
            validateOnMount
            validateOnChange
            validateOnBlur
        >
            {({ errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isValid,
                setFieldValue,
                touched,
                values, }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef, height }) => (
                        <form ref={setRef} className='poi-form-on-signup' onSubmit={handleSubmit} noValidate>
                            <ThemedScrollbars height={height}>
                                <div className='details-form'>
                                    <Div100vhContainer
                                        className='poi-form-on-signup__fields'
                                        height_offset='180px'
                                        is_disabled={isDesktop()}
                                    >
                                        <div className='proof-of-identity__container'>
                                            <DocumentSubmitLogo className='icon' />
                                            <Text className='proof-of-identity btm-spacer' align='center' weight='bold'>
                                                {localize('Identity information')}
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
                                                                    error={touched.document_number && errors.document_number}
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
                                                {(is_doc_selected) &&
                                                    <Text
                                                        className={classNames('proof-of-identity__text btm-spacer', {
                                                            'top-spacer': is_from_external,
                                                        })}
                                                        align='center'
                                                        size='xs'
                                                    >
                                                        <Localize
                                                            i18n_default_text='Please ensure all your personal details are the same as in your chosen document. If you wish to update your personal details, go to account settings.' />
                                                    </Text>
                                                }
                                            </div>
                                        </div>

                                    </Div100vhContainer>
                                </div>
                            </ThemedScrollbars>

                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    is_disabled={!values.document_number && !values.document_type || !isValid}
                                    label={localize('Next')}
                                    is_absolute={isMobile()}
                                    has_cancel
                                    cancel_label={localize('Previous')}
                                    onCancel={() => handleCancel(values)}
                                />
                            </Modal.Footer>
                        </form>
                    )}
                </AutoHeightWrapper>
            )
            }
        </Formik >
    )
};

ProofOfIdentityFormOnSignup.propTypes = {
    form_error: PropTypes.string,
    index: PropTypes.number,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    value: PropTypes.object,
    getCurrentStep: PropTypes.func,
    goToPreviousStep: PropTypes.func,
    goToNextStep: PropTypes.func,
    onSave: PropTypes.func,
    residence_list: PropTypes.arrayOf(PropTypes.object),
    citizen: PropTypes.string,
};


import React from 'react';
import { Formik, Field, FormikValues, FormikHelpers, FormikErrors } from 'formik';
import { localize, Localize } from '@deriv/translations';
import {
    Autocomplete,
    AutoHeightWrapper,
    DesktopWrapper,
    FormSubmitButton,
    Input,
    MobileWrapper,
    Modal,
    SelectNative,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { isDesktop, formatInput, isMobile } from '@deriv/shared';
import {
    documentAdditionalError,
    getDocumentData,
    getRegex,
    preventEmptyClipboardPaste,
} from '../../idv-document-submit/utils';
import DocumentSubmitLogo from 'Assets/ic-document-submit-icon.svg';
import { generatePlaceholderText } from 'Helpers/utils';

type TIdvDocSubmitOnSignup = {
    citizen_data: FormikValues;
    has_previous: boolean;
    onPrevious: (values: FormikValues) => void;
    onNext: (
        values: FormikValues,
        action: FormikHelpers<{ document_type: FormikValues; document_number: FormikValues }>
    ) => void;
    value: FormikValues;
    has_idv_error?: boolean;
};

export const IdvDocSubmitOnSignup = ({
    citizen_data,
    has_previous,
    onPrevious,
    onNext,
    value,
    has_idv_error,
}: TIdvDocSubmitOnSignup) => {
    const [document_list, setDocumentList] = React.useState<any[]>([]);
    const [document_image, setDocumentImage] = React.useState<string | null>(null);
    const [is_input_disable, setInputDisable] = React.useState(true);
    const [selected_doc, setSelectedDoc] = React.useState(null);
    const [input_value, setInputValue] = React.useState('');

    const document_data = citizen_data.identity.services.idv.documents_supported;
    const {
        value: country_code,
        identity: {
            services: {
                idv: { has_visual_sample },
            },
        },
    } = citizen_data;

    React.useEffect(() => {
        const document_types = Object.keys(document_data);
        const filtered_documents = ['gh', 'ng'].includes(country_code)
            ? document_types.filter(d => d !== 'voter_id')
            : document_types;

        setDocumentList(
            filtered_documents.map(key => {
                const { display_name, format } = document_data[key];
                const { new_display_name, example_format, sample_image } = getDocumentData(country_code, key);
                const needs_additional_document = !!document_data[key].additional;

                if (needs_additional_document) {
                    return {
                        id: key,
                        text: new_display_name || display_name,
                        additional: {
                            display_name: document_data[key].additional?.display_name,
                            format: document_data[key].additional?.format,
                        },
                        value: format,
                        sample_image,
                        example_format,
                    };
                }
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

    const initial_form_values = {
        document_type: value
            ? value.document_type
            : {
                  id: '',
                  text: '',
                  value: '',
                  example_format: '',
                  sample_image: '',
              },

        document_number: value ? value.document_number : '',
    };

    const validateFields = (values: FormikValues) => {
        const errors: FormikErrors<FormikValues> = {};
        const { document_type, document_number, document_additional } = values;
        const needs_additional_document = !!document_type.additional;
        const is_document_number_invalid = document_number === document_type.example_format;

        if (!document_type || !document_type.text || !document_type.value) {
            errors.document_type = localize('Please select a document type.');
        } else {
            setInputDisable(false);
        }

        if (needs_additional_document) {
            const error_message = documentAdditionalError(document_additional, document_type.additional?.format);
            if (error_message)
                errors.document_additional =
                    localize(error_message) + getExampleFormat(document_type.additional?.example_format);
        }

        if (!document_number) {
            errors.document_number =
                localize('Please enter your document number. ') + getExampleFormat(document_type.example_format);
        } else if (is_document_number_invalid) {
            errors.document_number = localize('Please enter a valid ID number.');
        } else {
            const format_regex = getRegex(document_type.value);
            if (!format_regex.test(document_number)) {
                errors.document_number =
                    localize('Please enter the correct format. ') + getExampleFormat(document_type.example_format);
            }
        }

        return errors;
    };

    const resetDocumentItemSelected = (setFieldValue: FormikHelpers<FormikValues>['setFieldValue']) => {
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

    const onKeyUp = (
        e: React.KeyboardEvent<HTMLInputElement>,
        document_name: string,
        values: FormikValues,
        setFieldValue: FormikHelpers<FormikValues>['setFieldValue']
    ) => {
        const { example_format } =
            document_name === 'document_number' ? values.document_type : values.document_type.additional;
        const current_input: string = example_format.includes('-')
            ? formatInput(example_format, current_input || e.target.value, '-')
            : e.target.value;
        setFieldValue(document_name, current_input, true);
        validateFields(values);
    };

    const getDocument = (text: string) => {
        return document_list.find((d: FormikValues) => d.text === text);
    };

    const getExampleFormat = (example_format: string) => {
        return example_format ? localize('Example: ') + example_format : '';
    };

    return (
        <Formik
            initialValues={initial_form_values}
            validate={validateFields}
            onSubmit={(values, actions) => {
                onNext(values, actions);
            }}
            validateOnMount
            validateOnChange
            validateOnBlur
        >
            {({
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
                <AutoHeightWrapper default_height={450} height_offset={isDesktop() ? 81 : null}>
                    {({ setRef }) => (
                        <form ref={setRef} className='poi-form-on-signup' onSubmit={handleSubmit} noValidate>
                            <ThemedScrollbars height='calc(100vh - 80px'>
                                <div className='details-form'>
                                    <div className='poi-form-on-signup__fields'>
                                        <div className='proof-of-identity__container'>
                                            <DocumentSubmitLogo className='icon' />
                                            <Text className='proof-of-identity btm-spacer' align='center' weight='bold'>
                                                {has_idv_error
                                                    ? localize('Verify your identity')
                                                    : localize('Identity information')}
                                            </Text>
                                            <Text className='proof-of-identity__text btm-spacer' size='xs'>
                                                {localize('Please select the document type and enter the ID number.')}
                                            </Text>
                                            {has_idv_error && !selected_doc && (
                                                <>
                                                    <Text
                                                        className='proof-of-identity'
                                                        size='xs'
                                                        align='center'
                                                        color='loss-danger'
                                                    >
                                                        {localize(
                                                            'We were unable to verify your ID with the details you provided.'
                                                        )}
                                                    </Text>
                                                    <Text
                                                        className='proof-of-identity btm-spacer'
                                                        size='xs'
                                                        align='center'
                                                        color='loss-danger'
                                                    >
                                                        {localize(
                                                            'Please check and resubmit or choose a different document type.'
                                                        )}
                                                    </Text>
                                                </>
                                            )}
                                            <div className='proof-of-identity__inner-container btm-spacer'>
                                                <div className='proof-of-identity__fieldset-container'>
                                                    <fieldset className='proof-of-identity__fieldset'>
                                                        <Field name='document'>
                                                            {({ field }: FormikValues) => (
                                                                <React.Fragment>
                                                                    <DesktopWrapper>
                                                                        <div className='document-dropdown'>
                                                                            <Autocomplete
                                                                                {...field}
                                                                                name='document_type'
                                                                                data-lpignore='true'
                                                                                error={
                                                                                    touched.document_type &&
                                                                                    errors.document_type
                                                                                }
                                                                                autoComplete='off'
                                                                                type='text'
                                                                                label={localize(
                                                                                    'Choose the document type'
                                                                                )}
                                                                                list_items={document_list}
                                                                                value={
                                                                                    values.document_type.text ??
                                                                                    input_value
                                                                                }
                                                                                onBlur={(
                                                                                    e: React.ChangeEvent<HTMLInputElement>
                                                                                ) => {
                                                                                    handleBlur(e);
                                                                                    if (!getDocument(e.target.value)) {
                                                                                        resetDocumentItemSelected(
                                                                                            setFieldValue
                                                                                        );
                                                                                    }
                                                                                }}
                                                                                onChange={(
                                                                                    e: React.ChangeEvent<HTMLInputElement>
                                                                                ) => {
                                                                                    setInputValue(e.target.value);
                                                                                    handleChange(e);
                                                                                }}
                                                                                onItemSelection={(
                                                                                    item: FormikValues
                                                                                ) => {
                                                                                    if (
                                                                                        item.text ===
                                                                                            'No results found' ||
                                                                                        !item.text
                                                                                    ) {
                                                                                        setSelectedDoc(null);
                                                                                        resetDocumentItemSelected(
                                                                                            setFieldValue
                                                                                        );
                                                                                    } else {
                                                                                        setFieldValue(
                                                                                            'document_type',
                                                                                            item,
                                                                                            true
                                                                                        );
                                                                                        setSelectedDoc(item.id);
                                                                                        if (has_visual_sample) {
                                                                                            setDocumentImage(
                                                                                                item.sample_image || ''
                                                                                            );
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
                                                                            error={
                                                                                touched.document_type &&
                                                                                errors.document_type
                                                                            }
                                                                            label={localize('Choose the document type')}
                                                                            list_items={document_list}
                                                                            value={values.document_type.text}
                                                                            onChange={e => {
                                                                                handleChange(e);
                                                                                const selected_document:
                                                                                    | undefined
                                                                                    | FormikValues = getDocument(
                                                                                    e.target.value
                                                                                );
                                                                                if (selected_document) {
                                                                                    setSelectedDoc(
                                                                                        selected_document.id
                                                                                    );
                                                                                    setFieldValue(
                                                                                        'document_type',
                                                                                        selected_document,
                                                                                        true
                                                                                    );
                                                                                    if (has_visual_sample) {
                                                                                        setDocumentImage(
                                                                                            // eslint-disable-next-line max-len
                                                                                            selected_document.sample_image
                                                                                        );
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
                                                            {({ field }: FormikValues) => (
                                                                <React.Fragment>
                                                                    <Input
                                                                        {...field}
                                                                        name='document_number'
                                                                        bottom_label={
                                                                            values.document_type &&
                                                                            getExampleFormat(
                                                                                values.document_type.example_format
                                                                            )
                                                                        }
                                                                        disabled={is_input_disable}
                                                                        error={
                                                                            (touched.document_number &&
                                                                                errors.document_number) ||
                                                                            errors.error_message
                                                                        }
                                                                        autoComplete='off'
                                                                        placeholder={generatePlaceholderText(
                                                                            selected_doc
                                                                        )}
                                                                        value={values.document_number}
                                                                        onPaste={preventEmptyClipboardPaste}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        onKeyUp={(
                                                                            e: React.KeyboardEvent<HTMLInputElement>
                                                                        ) =>
                                                                            onKeyUp(
                                                                                e,
                                                                                'document_number',
                                                                                values,
                                                                                setFieldValue
                                                                            )
                                                                        }
                                                                        required
                                                                    />
                                                                    {values.document_type.additional?.display_name && (
                                                                        <Input
                                                                            {...field}
                                                                            name='document_additional'
                                                                            bottom_label={
                                                                                values.document_type.additional &&
                                                                                getExampleFormat(
                                                                                    values.document_type.additional
                                                                                        ?.example_format
                                                                                )
                                                                            }
                                                                            disabled={is_input_disable}
                                                                            error={
                                                                                (touched.document_additional &&
                                                                                    errors.document_additional) ||
                                                                                errors.error_message
                                                                            }
                                                                            autoComplete='off'
                                                                            placeholder={`Enter your ${values.document_type.additional?.display_name.toLowerCase()}`}
                                                                            value={values.document_additional}
                                                                            onPaste={preventEmptyClipboardPaste}
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            onKeyUp={(
                                                                                e: React.KeyboardEvent<HTMLInputElement>
                                                                            ) =>
                                                                                onKeyUp(
                                                                                    e,
                                                                                    'document_additional',
                                                                                    values,
                                                                                    setFieldValue
                                                                                )
                                                                            }
                                                                            required
                                                                        />
                                                                    )}
                                                                </React.Fragment>
                                                            )}
                                                        </Field>
                                                    </fieldset>
                                                </div>
                                                {document_image && (
                                                    <div className='proof-of-identity__sample-container'>
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
                                                {selected_doc && (
                                                    <Text
                                                        className='proof-of-identity__text-spacer'
                                                        align='center'
                                                        size='xs'
                                                    >
                                                        <Localize i18n_default_text='Please ensure all your personal details are the same as in your chosen document. If you wish to update your personal details, go to account settings.' />
                                                    </Text>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ThemedScrollbars>

                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    is_disabled={
                                        (!values.document_number && !values.document_type) || !isValid || isSubmitting
                                    }
                                    label={localize('Next')}
                                    is_absolute={isMobile()}
                                    has_cancel={has_previous}
                                    cancel_label={localize('Previous')}
                                    onCancel={() => onPrevious(values)}
                                />
                            </Modal.Footer>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

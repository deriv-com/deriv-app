import React from 'react';
import { Form, Field } from 'formik';
import { localize, Localize } from '@deriv/translations';
import { formatInput, IDV_NOT_APPLICABLE_OPTION } from '@deriv/shared';
import { Autocomplete, DesktopWrapper, Input, MobileWrapper, SelectNative, Text } from '@deriv/components';
import { getDocumentData, preventEmptyClipboardPaste } from 'Helpers/utils.js';
import classNames from 'classnames';

const IDVForm = ({ errors, touched, values, handleBlur, handleChange, setFieldValue, ...props }) => {
    const [document_list, setDocumentList] = React.useState([]);
    const [document_image, setDocumentImage] = React.useState(null);
    const [is_doc_selected, setDocSelected] = React.useState(false);

    const { account_settings, residence, residence_list } = props;
    const citizen = account_settings?.citizen || residence;
    const { documents_supported: document_data, has_visual_sample } =
        residence_list.find(residence_data => residence_data.value === citizen)?.identity.services?.idv || {};

    React.useEffect(() => {
        const document_types = Object.keys(document_data);
        if (document_types.length === 0) return;
        const filtered_documents = ['gh', 'ng'].includes(citizen)
            ? document_types.filter(d => d !== 'voter_id')
            : document_types;

        setDocumentList([
            ...filtered_documents.map(key => {
                const { display_name, format } = document_data[key];
                const { new_display_name, example_format, sample_image } = getDocumentData(citizen, key);
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
            }),
            IDV_NOT_APPLICABLE_OPTION,
        ]);
    }, [document_data]);

    const resetDocumentItemSelected = () => {
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
    };

    const getExampleFormat = example_format => {
        return example_format ? localize('Example: ') + example_format : '';
    };
    const getDocument = text => {
        return document_list.find(d => d.text === text);
    };

    const onKeyUp = (e, document_name) => {
        const { example_format } =
            document_name === 'document_number' ? values.document_type : values.document_type.additional;
        const current_input = example_format.includes('-')
            ? formatInput(example_format, current_input || e.target.value, '-')
            : e.target.value;
        setFieldValue(document_name, current_input, true);
    };

    return (
        <Form className='idv-form'>
            <div className='details-form'>
                <div className='poi-form-on-signup__fields'>
                    <div
                        className={classNames('proof-of-identity__container', {
                            'proof-of-identity__container--idv': props.hide_hint,
                        })}
                    >
                        <div
                            className={classNames('proof-of-identity__inner-container', {
                                'btm-spacer': !props.hide_hint,
                            })}
                        >
                            <div className='proof-of-identity__fieldset-container'>
                                <fieldset className={classNames({ 'proof-of-identity__fieldset': !props.hide_hint })}>
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
                                                            value={values.document_type.text ?? ''}
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
                                <fieldset
                                    className={classNames({ 'proof-of-identity__fieldset-input': !props.hide_hint })}
                                >
                                    <Field name='document_number'>
                                        {({ field }) => (
                                            <React.Fragment>
                                                <Input
                                                    {...field}
                                                    name='document_number'
                                                    bottom_label={
                                                        values.document_type &&
                                                        getExampleFormat(values.document_type.example_format)
                                                    }
                                                    disabled={
                                                        !values.document_type.id ||
                                                        values.document_type.id === IDV_NOT_APPLICABLE_OPTION.id
                                                    }
                                                    error={
                                                        (touched.document_number && errors.document_number) ||
                                                        errors.error_message
                                                    }
                                                    autoComplete='off'
                                                    placeholder='Enter your document number'
                                                    value={values.document_number}
                                                    onPaste={preventEmptyClipboardPaste}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    onKeyUp={e => onKeyUp(e, 'document_number')}
                                                    required
                                                />
                                                {values.document_type.additional?.display_name && (
                                                    <Input
                                                        {...field}
                                                        name='document_additional'
                                                        bottom_label={
                                                            values.document_type.additional &&
                                                            getExampleFormat(
                                                                values.document_type.additional?.example_format
                                                            )
                                                        }
                                                        disabled={
                                                            !values.document_type.id ||
                                                            values.document_type.id === IDV_NOT_APPLICABLE_OPTION.id
                                                        }
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
                                                        onKeyUp={e => onKeyUp(e, 'document_additional')}
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
                            {is_doc_selected && !props.hide_hint && (
                                <Text className='proof-of-identity__text-spacer' align='center' size='xs'>
                                    <Localize i18n_default_text='Please ensure all your personal details are the same as in your chosen document. If you wish to update your personal details, go to account settings.' />
                                </Text>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    );
};

export default IDVForm;

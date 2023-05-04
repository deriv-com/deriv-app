import React from 'react';
import classNames from 'classnames';
import { Field, FormikValues, FormikProps, FormikHandlers } from 'formik';
import { ResidenceList } from '@deriv/api-types';
import { localize, Localize } from '@deriv/translations';
import { formatInput, IDV_NOT_APPLICABLE_OPTION } from '@deriv/shared';
import { Autocomplete, DesktopWrapper, Input, MobileWrapper, SelectNative, Text } from '@deriv/components';
import { getDocumentData, preventEmptyClipboardPaste, generatePlaceholderText } from 'Helpers/utils';

type TDocumentList = Array<{
    id: string;
    text: string;
    value?: string;
    sample_image?: string;
    example_format?: string;
    additional?: any;
}>;

type TFormProps = {
    document_type: TDocumentList[0];
    document_number: string;
    document_additional: string;
};

type TIDVForm = {
    selected_country: ResidenceList[0];
    is_from_external: boolean;
    hide_hint?: boolean;
    class_name?: string;
} & FormikHandlers &
    FormikProps<TFormProps>;

const IDVForm = ({
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    setFieldValue,
    class_name,
    ...props
}: TIDVForm) => {
    const [document_list, setDocumentList] = React.useState<TDocumentList>([]);
    const [document_image, setDocumentImage] = React.useState(null);
    const [selected_doc, setSelectedDoc] = React.useState('');

    const { selected_country, is_from_external } = props;
    // const citizen = account_settings?.citizen || residence;

    const { documents_supported: document_data, has_visual_sample } = selected_country?.identity?.services?.idv || {};
    // residence_list.find(residence_data => residence_data.value === citizen)?.identity.services?.idv || {};

    React.useEffect(() => {
        const document_types = Object.keys(document_data);
        if (document_types.length === 0) return;
        const filtered_documents = ['gh', 'ng'].includes(selected_country.value)
            ? document_types.filter(d => d !== 'voter_id')
            : document_types;

        setDocumentList([
            ...filtered_documents.map(key => {
                const { display_name, format } = document_data[key];
                const { new_display_name, example_format, sample_image } = getDocumentData(selected_country.value, key);
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

    const getExampleFormat = (example_format: string) => {
        return example_format ? localize('Example: ') + example_format : '';
    };
    const getDocument = (text: string) => {
        return document_list.find(d => d.text === text);
    };

    const onKeyUp = (e: { target: HTMLInputElement }, document_name: string) => {
        const { example_format } =
            document_name === 'document_number' ? values.document_type : values.document_type.additional;
        let current_input: string | null = null;
        current_input = example_format.includes('-')
            ? formatInput(example_format, current_input || e.target.value, '-')
            : e.target.value;
        setFieldValue(document_name, current_input, true);
    };

    return (
        <React.Fragment>
            <section className={classNames('idv-form', class_name)}>
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
                                    <fieldset
                                        className={classNames({ 'proof-of-identity__fieldset': !props.hide_hint })}
                                    >
                                        <Field name='document'>
                                            {({ field }: FormikValues) => (
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
                                                                onBlur={(e: { target: HTMLInputElement }) => {
                                                                    handleBlur(e);
                                                                    if (!getDocument(e.target.value)) {
                                                                        resetDocumentItemSelected();
                                                                    }
                                                                }}
                                                                onChange={handleChange}
                                                                onItemSelection={item => {
                                                                    if (
                                                                        item.text === 'No results found' ||
                                                                        !item.text
                                                                    ) {
                                                                        setSelectedDoc('');
                                                                        resetDocumentItemSelected();
                                                                    } else {
                                                                        setFieldValue('document_type', item, true);
                                                                        setSelectedDoc(item.id);
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
                                                                    setSelectedDoc(selected_document.id);
                                                                    setFieldValue(
                                                                        'document_type',
                                                                        selected_document,
                                                                        true
                                                                    );
                                                                    if (has_visual_sample) {
                                                                        setDocumentImage(
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
                                        className={classNames({
                                            'proof-of-identity__fieldset-input': !props.hide_hint,
                                        })}
                                    >
                                        <Field name='document_number'>
                                            {({ field }: FormikValues) => (
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
                                                        placeholder={generatePlaceholderText(selected_doc)}
                                                        value={values.document_number}
                                                        onPaste={preventEmptyClipboardPaste}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        onKeyUp={(e: { target: HTMLInputElement }) =>
                                                            onKeyUp(e, 'document_number')
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
                                                            onKeyUp={(e: { target: HTMLInputElement }) =>
                                                                onKeyUp(e, 'document_additional')
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {selected_doc && !props.hide_hint && (
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
        </React.Fragment>
    );
};

export default IDVForm;

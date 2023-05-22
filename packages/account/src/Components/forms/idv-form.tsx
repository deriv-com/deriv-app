import React from 'react';
import classNames from 'classnames';
import { Field, FormikProps, FormikHandlers, FieldProps } from 'formik';
import { ResidenceList } from '@deriv/api-types';
import { localize } from '@deriv/translations';
import { formatInput, IDV_NOT_APPLICABLE_OPTION } from '@deriv/shared';
import { Autocomplete, DesktopWrapper, Input, MobileWrapper, SelectNative, Text } from '@deriv/components';
import { getDocumentData, preventEmptyClipboardPaste, generatePlaceholderText, getExampleFormat } from 'Helpers/utils';

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
    document_additional?: string;
    error_message?: string;
};

type TIDVForm = {
    selected_country: ResidenceList[0];
    hide_hint?: boolean;
    class_name?: string;
    can_skip_document_verification: boolean;
} & Partial<FormikHandlers> &
    FormikProps<TFormProps>;

const IDVForm = ({
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    setFieldValue,
    class_name,
    selected_country,
    hide_hint,
    can_skip_document_verification = false,
}: TIDVForm) => {
    const [document_list, setDocumentList] = React.useState<TDocumentList>([]);
    const [document_image, setDocumentImage] = React.useState<string | null>(null);
    const [selected_doc, setSelectedDoc] = React.useState('');

    const { documents_supported: document_data, has_visual_sample } = selected_country?.identity?.services?.idv ?? {};

    const default_document = {
        id: '',
        text: '',
        value: '',
        example_format: '',
        sample_image: '',
    };

    React.useEffect(() => {
        if (document_data && selected_country && selected_country.value) {
            const document_types = Object.keys(document_data);
            if (document_types.length === 0) return;
            const filtered_documents = ['gh', 'ng'].includes(selected_country.value)
                ? document_types.filter(d => d !== 'voter_id')
                : document_types;

            const new_document_list = filtered_documents.map(key => {
                const { display_name, format } = document_data[key];
                const { new_display_name, example_format, sample_image } = getDocumentData(
                    selected_country.value ?? '',
                    key
                );
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
            });
            if (can_skip_document_verification) {
                setDocumentList([...new_document_list, IDV_NOT_APPLICABLE_OPTION]);
            } else {
                setDocumentList([...new_document_list]);
            }
        }
    }, [document_data, selected_country, can_skip_document_verification]);

    const resetDocumentItemSelected = () => {
        setFieldValue('document_type', default_document, true);
    };

    const getDocument = (text: string) => {
        return document_list.find(d => d.text === text) ?? default_document;
    };

    const onKeyUp = (e: { target: HTMLInputElement }, document_name: string) => {
        const { example_format } =
            document_name === 'document_number' ? values.document_type : values.document_type.additional;
        let current_input: string | null = null;
        current_input = example_format.includes('-')
            ? formatInput(example_format, current_input ?? e.target.value, '-')
            : e.target.value;
        setFieldValue(document_name, current_input, true);
    };

    const bindDocumentData = (item: TDocumentList[0]) => {
        setFieldValue('document_type', item, true);
        setSelectedDoc(item?.id);
        if (item?.id === IDV_NOT_APPLICABLE_OPTION.id) {
            setFieldValue('document_number', '', true);
            setFieldValue('document_additional', '', true);
        }
        if (has_visual_sample) {
            setDocumentImage(item.sample_image ?? '');
        }
    };

    return (
        <React.Fragment>
            <section className={classNames('idv-form', class_name)}>
                <div className='details-form'>
                    <div className='poi-form-on-signup__fields'>
                        <div
                            className={classNames('proof-of-identity__container', {
                                'proof-of-identity__container--idv': hide_hint,
                            })}
                        >
                            <div
                                className={classNames('proof-of-identity__inner-container', {
                                    'proof-of-identity__inner-container--incl-image': document_image,
                                })}
                            >
                                <div className='proof-of-identity__fieldset-container'>
                                    <fieldset className={classNames({ 'proof-of-identity__fieldset': !hide_hint })}>
                                        <Field name='document_type'>
                                            {({ field }: FieldProps) => (
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
                                                                onItemSelection={(item: TDocumentList[0]) => {
                                                                    if (
                                                                        item.text === 'No results found' ||
                                                                        !item.text
                                                                    ) {
                                                                        setSelectedDoc('');
                                                                        resetDocumentItemSelected();
                                                                    } else {
                                                                        bindDocumentData(item);
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
                                                                (errors.document_type as string | undefined)
                                                            }
                                                            label={localize('Choose the document type')}
                                                            placeholder={localize('Please select')}
                                                            list_items={document_list}
                                                            value={values.document_type.text}
                                                            onChange={e => {
                                                                handleChange(e);
                                                                const selected_document = getDocument(e.target.value);
                                                                bindDocumentData(selected_document);
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
                                            'proof-of-identity__fieldset-input': !hide_hint,
                                        })}
                                    >
                                        <Field name='document_number'>
                                            {({ field }: FieldProps) => (
                                                <React.Fragment>
                                                    <Input
                                                        {...field}
                                                        name='document_number'
                                                        bottom_label={
                                                            values.document_type &&
                                                            getExampleFormat(values.document_type.example_format ?? '')
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
                                                        label={generatePlaceholderText(selected_doc)}
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
        </React.Fragment>
    );
};

export default IDVForm;

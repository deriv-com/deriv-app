import React, { useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, FormikProps, useFormikContext } from 'formik';
import { useResidenceList } from '@deriv/api';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown, Input, useDevice } from '@deriv-com/ui';
import { DOCUMENT_LIST } from '../../mocks/idv-form.mock';
import { getIDVNotApplicableOption } from '../../utils/defaultOptions';
import { getExampleFormat, getSelectedDocumentConfigData, TDocument } from '../../utils/idvFormUtils';

type TIDVFormProps = {
    allowDefaultValue?: boolean;
    allowIDVSkip?: boolean;
    selectedCountry: Exclude<
        NonNullable<NonNullable<ReturnType<typeof useResidenceList>['data'][0]['identity']>['services']>['idv'],
        undefined
    >;
};

type TIDVFormValues = {
    document_additional?: string;
    document_number: string;
    document_type: string;
};

type TDropDownList = {
    text: string;
    value: string;
};

export const IDVForm = ({ allowDefaultValue, allowIDVSkip, selectedCountry }: TIDVFormProps) => {
    const formik: FormikProps<TIDVFormValues> = useFormikContext();

    const [documentList, setDocumentList] = useState<TDropDownList[]>([]);

    const [selectedDocument, setSelectedDocument] = useState<TDocument | undefined>();

    const { isMobile } = useDevice();

    const { documents_supported } = selectedCountry;

    const IDV_NOT_APPLICABLE_OPTION = useMemo(() => getIDVNotApplicableOption(allowIDVSkip), [allowIDVSkip]);

    const defaultDocument = {
        example_format: '',
        id: '',
        text: '',
        value: '',
    };

    useEffect(() => {
        if (documents_supported && Object.keys(documents_supported)?.length) {
            const docList = Object.keys(documents_supported).map((key: string) => {
                return {
                    text: documents_supported[key].display_name,
                    value: key,
                };
            });

            if (allowDefaultValue) {
                setDocumentList([...docList, IDV_NOT_APPLICABLE_OPTION] as TDropDownList[]);
            } else {
                setDocumentList([...docList] as TDropDownList[]);
            }
        }
    }, [documents_supported, IDV_NOT_APPLICABLE_OPTION, allowDefaultValue]);

    if (!formik) {
        throw new Error('IDVForm must be used within a Formik component');
    }

    const { setFieldValue, values } = formik;

    const bindDocumentData = (item: string) => {
        setFieldValue('document_type', item, true);
        setSelectedDocument(getSelectedDocumentConfigData(item, DOCUMENT_LIST));
        if (item === IDV_NOT_APPLICABLE_OPTION.value) {
            setFieldValue('document_number', '', true);
            setFieldValue('document_additional', '', true);
        }
    };

    const handleSelect = (item: string) => {
        if (item === 'No results found') {
            setFieldValue('document_type', defaultDocument, true);
        } else {
            bindDocumentData(item);
        }
    };

    return (
        <section className='flex flex-col gap-75'>
            <Field name='document_type'>
                {({ field, meta }: FieldProps) => (
                    <Dropdown
                        aria-label='Choose the document type'
                        dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                        errorMessage={meta.touched && meta.error}
                        isRequired
                        label='Choose the document type'
                        list={documentList}
                        name={field.name}
                        onSearch={field.onChange} // [TODO] - To be removed once prop is renamed to onChange
                        onSelect={values => handleSelect(values as string)} // Need to override the Type Error. Will be fixed when Dropdown component is updated
                        value={field.value}
                        variant={isMobile ? 'comboBox' : 'prompt'}
                    />
                )}
            </Field>
            {values?.document_type !== IDV_NOT_APPLICABLE_OPTION.value && (
                <Field name='document_number'>
                    {({ field, meta }: FieldProps) => (
                        <Input
                            {...field}
                            aria-label='Enter your document number'
                            disabled={!values.document_type}
                            error={meta.touched && Boolean(meta.error)}
                            label='Enter your document number'
                            message={meta.error ?? getExampleFormat(selectedDocument?.example_format)}
                        />
                    )}
                </Field>
            )}
            {selectedDocument?.additional?.display_name && (
                <Field name='document_additional'>
                    {({ field, meta }: FieldProps) => (
                        <Input
                            {...field}
                            aria-label='Enter additional document number'
                            disabled={!selectedDocument?.additional}
                            error={meta.touched && Boolean(meta.error)}
                            label='Enter additional document number'
                            message={meta.error ?? getExampleFormat(selectedDocument?.additional?.example_format)}
                        />
                    )}
                </Field>
            )}
        </section>
    );
};

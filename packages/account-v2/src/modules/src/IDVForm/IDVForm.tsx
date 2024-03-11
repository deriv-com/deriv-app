import React, { useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, FormikProps, useFormikContext } from 'formik';
import { useResidenceList } from '@deriv/api-v2';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown, Input, useDevice } from '@deriv-com/ui';
import { getIDVNotApplicableOption } from '../../../utils/defaultOptions';
import { getExampleFormat, getSelectedDocumentConfigData, TDocument } from '../../../utils/idvFormUtils';

type TIDVFormProps = {
    allowDefaultValue?: boolean;
    allowIDVSkip?: boolean;
    selectedCountry: Exclude<
        NonNullable<NonNullable<ReturnType<typeof useResidenceList>['data'][0]['identity']>['services']>['idv'],
        undefined
    >;
};

type TIDVFormValues = {
    additionalDocument?: string;
    documentNumber: string;
    documentType: string;
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

    const { documents_supported: supportedDocuments } = selectedCountry;

    const idvNotApplicableOption = useMemo(() => getIDVNotApplicableOption(allowIDVSkip), [allowIDVSkip]);

    const defaultDocument = {
        example_format: '',
        id: '',
        text: '',
        value: '',
    };

    useEffect(() => {
        if (supportedDocuments && Object.keys(supportedDocuments)?.length) {
            const docList = Object.keys(supportedDocuments).map((key: string) => {
                return {
                    text: supportedDocuments[key].display_name,
                    value: key,
                };
            });

            if (allowDefaultValue) {
                setDocumentList([...docList, idvNotApplicableOption] as TDropDownList[]);
            } else {
                setDocumentList([...docList] as TDropDownList[]);
            }
        }
    }, [supportedDocuments, idvNotApplicableOption, allowDefaultValue]);

    if (!formik) {
        throw new Error('IDVForm must be used within a Formik component');
    }

    const { setFieldValue, values } = formik;

    const bindDocumentData = (item: string) => {
        setFieldValue('documentType', item, true);
        setSelectedDocument(getSelectedDocumentConfigData(item, mockDocumentList));
        if (item === idvNotApplicableOption.value) {
            setFieldValue('documentNumber', '', true);
            setFieldValue('additionalDocument', '', true);
        }
    };

    const handleSelect = (item: string) => {
        if (item === 'No results found') {
            setFieldValue('documentType', defaultDocument, true);
        } else {
            bindDocumentData(item);
        }
    };

    return (
        <section className='flex flex-col gap-75'>
            <Field name='documentType'>
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
            {values?.documentType !== idvNotApplicableOption.value && (
                <Field name='documentNumber'>
                    {({ field, meta }: FieldProps) => (
                        <Input
                            {...field}
                            aria-label='Enter your document number'
                            disabled={!values.documentType}
                            error={meta.touched && Boolean(meta.error)}
                            label='Enter your document number'
                            message={meta.error ?? getExampleFormat(selectedDocument?.example_format)}
                        />
                    )}
                </Field>
            )}
            {selectedDocument?.additional?.display_name && (
                <Field name='additionalDocument'>
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

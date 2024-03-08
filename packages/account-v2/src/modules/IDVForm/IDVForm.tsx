import React, { useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, FormikProps, useFormikContext } from 'formik';
import { InferType } from 'yup';
import { useKycAuthStatus } from '@deriv/api-v2';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Divider, Dropdown, Input, Text, useDevice } from '@deriv-com/ui';
import { FormDropDownField, FormInputField } from '../../components/FormFields';
import { PersonalDetailsFormWithExample } from '../../containers';
import { DOCUMENT_LIST } from '../../mocks/idv-form.mock';
import { getIDVNotApplicableOption } from '../../utils/defaultOptions';
import {
    getExampleFormat,
    getIDVFormValidationSchema,
    getSelectedDocumentConfigData,
    TDocument,
} from '../../utils/idvFormUtils';

type TIDVFormProps = {
    allowDefaultValue?: boolean;
    allowIDVSkip?: boolean;
    supportedDocuments: Exclude<
        Exclude<ReturnType<typeof useKycAuthStatus>['kyc_auth_status'], undefined>['identity']['supported_documents'],
        undefined
    >['idv'];
};

type TIDVFormValues = InferType<ReturnType<typeof getIDVFormValidationSchema>>;

type TDropDownList = {
    text: string;
    value: string;
};

export const IDVForm = ({ allowDefaultValue, allowIDVSkip, supportedDocuments }: TIDVFormProps) => {
    const formik = useFormikContext<TIDVFormValues>();

    const [documentList, setDocumentList] = useState<TDropDownList[]>([]);

    const [selectedDocument, setSelectedDocument] = useState<TDocument | undefined>();

    const IDV_NOT_APPLICABLE_OPTION = useMemo(() => getIDVNotApplicableOption(allowIDVSkip), [allowIDVSkip]);

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
                setDocumentList([...docList, IDV_NOT_APPLICABLE_OPTION] as TDropDownList[]);
            } else {
                setDocumentList([...docList] as TDropDownList[]);
            }
        }
    }, [supportedDocuments, IDV_NOT_APPLICABLE_OPTION, allowDefaultValue]);

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
            {/* <Field name='document_type'>
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
                            isFullWidth
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
                            isFullWidth
                            label='Enter additional document number'
                            message={meta.error ?? getExampleFormat(selectedDocument?.additional?.example_format)}
                        />
                    )}
                </Field>
            )} */}
            <FormDropDownField
                handleSelect={handleSelect}
                label='Choose the document type'
                list={documentList}
                name='documentType'
            />
            {values?.documentType !== IDV_NOT_APPLICABLE_OPTION.value && (
                <FormInputField
                    disabled={!values?.documentNumber}
                    isFullWidth
                    label='Enter your document number'
                    message={getExampleFormat(selectedDocument?.example_format)}
                    name='documentNumber'
                />
            )}
            {selectedDocument?.additional?.display_name && (
                <FormInputField
                    disabled={!values?.documentAdditional}
                    isFullWidth
                    label='Enter additional document number'
                    message={getExampleFormat(selectedDocument?.example_format)}
                    name='documentAdditional'
                />
            )}
        </section>
    );
};

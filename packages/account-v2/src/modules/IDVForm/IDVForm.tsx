import React, { useEffect, useMemo, useState } from 'react';
import { useFormikContext } from 'formik';
import { InferType } from 'yup';
import { useKycAuthStatus } from '@deriv/api-v2';
import { FormDropDownField, FormInputField } from '../../components/FormFields';
import { getIDVNotApplicableOption } from '../../utils/defaultOptions';
import {
    generatePlaceholderText,
    getExampleFormat,
    getIDVFormValidationSchema,
    getSelectedDocumentConfigData,
    TDocument,
} from '../../utils/idvFormUtils';

type TIDVFormProps = {
    allowDefaultValue?: boolean;
    allowIDVSkip?: boolean;
    countryCode: string;
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

export const IDVForm = ({ allowDefaultValue, allowIDVSkip, countryCode, supportedDocuments }: TIDVFormProps) => {
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

    const validationSchema = getIDVFormValidationSchema(countryCode, supportedDocuments);

    const bindDocumentData = (item: string) => {
        setFieldValue('documentType', item, true);
        setSelectedDocument(getSelectedDocumentConfigData(countryCode, item, supportedDocuments));
        if (item === IDV_NOT_APPLICABLE_OPTION.value) {
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
        <section className='flex flex-col gap-16'>
            <FormDropDownField
                handleSelect={handleSelect}
                label='Choose the document type'
                list={documentList}
                name='documentType'
                validationSchema={validationSchema.fields.documentType}
            />
            {values?.documentType !== IDV_NOT_APPLICABLE_OPTION.value && (
                <FormInputField
                    disabled={!values?.documentType}
                    isFullWidth
                    label={generatePlaceholderText(values?.documentType)}
                    message={getExampleFormat(selectedDocument?.exampleFormat)}
                    name='documentNumber'
                    validationSchema={validationSchema.fields.documentNumber}
                />
            )}
            {selectedDocument?.additional?.displayName && (
                <FormInputField
                    disabled={!values?.documentNumber}
                    isFullWidth
                    label='Enter additional document number'
                    message={getExampleFormat(selectedDocument?.additional?.exampleFormat)}
                    name='additionalDocument'
                    validationSchema={validationSchema.fields.additionalDocument}
                />
            )}
        </section>
    );
};

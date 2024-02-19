import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, FormikProps, useFormikContext } from 'formik';
import { useResidenceList } from '@deriv/api';
import { useDevice } from '@deriv-com/ui';
import { WalletDropdown } from '../../components/base/WalletDropdown';
import { WalletTextField } from '../../components/base/WalletTextField';
import { DOCUMENT_LIST } from '../../mocks/idv-form.mock';
import { getIDVNotApplicableOption } from '../../utils/default-options';
import { getSelectedDocumentConfigData, TDocument } from '../../utils/idv-form-utils';

type TIDVFormProps = {
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

export const IDVForm = ({ allowIDVSkip, selectedCountry }: TIDVFormProps) => {
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
            setDocumentList(docList as TDropDownList[]);
        }
    }, [documents_supported]);

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
        <Fragment>
            <section className='flex flex-col gap-75'>
                <Field name='document_type'>
                    {({ field, meta }: FieldProps) => (
                        <WalletDropdown
                            {...field}
                            errorMessage={meta.touched && meta.error}
                            isRequired
                            label='Choose the document type'
                            list={documentList}
                            onSelect={handleSelect}
                            variant={isMobile ? 'prompt' : 'comboBox'}
                        />
                    )}
                </Field>
                {values?.document_type !== IDV_NOT_APPLICABLE_OPTION.value && (
                    <Field name='document_number'>
                        {({ field, meta }: FieldProps) => (
                            <WalletTextField
                                {...field}
                                disabled={!values.document_type}
                                errorMessage={meta.error}
                                isInvalid={meta.touched && Boolean(meta.error)}
                                label='Enter your document number'
                            />
                        )}
                    </Field>
                )}
                {selectedDocument?.additional?.display_name && (
                    <Field name='document_additional'>
                        {({ field, meta }: FieldProps) => (
                            <WalletTextField
                                {...field}
                                disabled={!selectedDocument?.additional}
                                errorMessage={meta.error}
                                isInvalid={meta.touched && Boolean(meta.error)}
                                label='Enter additional document number'
                            />
                        )}
                    </Field>
                )}
            </section>
            {/* [TODO]:Mock - Remove Display for form values */}
            <section>
                <p>Document Type: {values?.document_type}</p>
                <p>Document Number: {values.document_number}</p>
                <p>Additional Document number: {values.document_additional ?? '--'} </p>
            </section>
        </Fragment>
    );
};

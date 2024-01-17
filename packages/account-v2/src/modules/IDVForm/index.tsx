import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, FormikProps, useFormikContext } from 'formik';
import { ResidenceList } from '@deriv/api-types';
import { WalletDropdown } from '../../components/base/WalletDropdown';
import { WalletTextField } from '../../components/base/WalletTextField';
import { ResponsiveWrapper } from '../../components/responsive-wrapper';
import { getIDVNotApplicableOption } from '../../utils/default-options';
import { getSelectedDocumentConfigData } from './utils';

type TIDVFormProps = {
    allowIDVSkip?: boolean;
    selectedCountry: ResidenceList[0];
};

type TDocument = {
    additional?: {
        display_name?: string;
        example_format?: string;
    };
    example_format?: string;
    id: string;
    text: string;
    value?: string;
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
    const { setFieldValue, values }: FormikProps<TIDVFormValues> = useFormikContext();
    const [documentList, setDocumentList] = useState<TDropDownList[]>([]);
    const defaultDocument = {
        example_format: '',
        id: '',
        text: '',
        value: '',
    };
    const [selectedDocument, setSelectedDocument] = useState<TDocument | undefined>();

    const { documents_supported } = selectedCountry?.identity?.services?.idv ?? {};

    const IDV_NOT_APPLICABLE_OPTION = useMemo(() => getIDVNotApplicableOption(allowIDVSkip), [allowIDVSkip]);

    const bindDocumentData = (item: string) => {
        setFieldValue('document_type', item, true);
        setSelectedDocument(getSelectedDocumentConfigData(item));
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

    useEffect(() => {
        if (Object.keys(documents_supported as Exclude<typeof documents_supported, undefined>)?.length) {
            const docList = Object.keys(documents_supported as Exclude<typeof documents_supported, undefined>).map(
                (key: string) => {
                    return {
                        text: (documents_supported as Exclude<typeof documents_supported, undefined>)[key].display_name,
                        value: key,
                    };
                }
            );
            setDocumentList(docList as TDropDownList[]);
        }
    }, [documents_supported]);

    return (
        <Fragment>
            <section className='flex flex-col gap-75'>
                <Field name='document_type'>
                    {({ field, meta }: FieldProps) => (
                        <ResponsiveWrapper>
                            {{
                                desktop: (
                                    <WalletDropdown
                                        {...field}
                                        errorMessage={meta.touched && meta.error}
                                        isRequired
                                        label='Choose the document type'
                                        list={documentList}
                                        onSelect={handleSelect}
                                        variant='comboBox'
                                    />
                                ),
                                mobile: (
                                    <WalletDropdown
                                        {...field}
                                        errorMessage={meta.touched && meta.error}
                                        isRequired
                                        label='Choose the document type'
                                        list={documentList}
                                        onSelect={handleSelect}
                                        variant='prompt'
                                    />
                                ),
                            }}
                        </ResponsiveWrapper>
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

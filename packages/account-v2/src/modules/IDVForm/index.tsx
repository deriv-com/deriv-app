import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, FormikProps, useFormikContext } from 'formik';
import { ResidenceList } from '@deriv/api-types';
import { WalletDropdown } from '../../components/base/WalletDropdown';
import { WalletTextField } from '../../components/base/WalletTextField';
import { ResponsiveWrapper } from '../../components/responsive-wrapper';
import { DOCUMENT_LIST } from '../../mocks/idv-form.mock';
import { getIDVNotApplicableOption } from '../../utils/default-options';

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
    document_type: TDocument;
    error_message?: string;
};

type TDropDownList = {
    text: string;
    value: string;
};

export const IDVForm = ({ allowIDVSkip, selectedCountry }: TIDVFormProps) => {
    const { errors, handleChange, setFieldValue, values }: FormikProps<TIDVFormValues> = useFormikContext();
    const [documentList, setDocumentList] = useState<TDropDownList[]>([]);

    const defaultDocument = {
        example_format: '',
        id: '',
        text: '',
        value: '',
    };

    const { documents_supported } = selectedCountry?.identity?.services?.idv ?? {};

    const IDV_NOT_APPLICABLE_OPTION = useMemo(() => getIDVNotApplicableOption(allowIDVSkip), [allowIDVSkip]);

    const bindDocumentData = (item: string) => {
        setFieldValue('document_type', getSelectedDocumentConfigData(item), true);
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

    const getSelectedDocumentConfigData = useCallback((item: string) => {
        return DOCUMENT_LIST.find(doc => doc.id === item);
    }, []);

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
            <section>
                <Field name='document_type'>
                    {({ field }: FieldProps) => (
                        <ResponsiveWrapper>
                            {{
                                desktop: (
                                    <WalletDropdown
                                        {...field}
                                        errorMessage='Document type is required'
                                        isRequired
                                        label='Choose the document type'
                                        list={documentList}
                                        onChange={handleChange}
                                        onSelect={handleSelect}
                                        variant='comboBox'
                                    />
                                ),
                                mobile: (
                                    <WalletDropdown
                                        {...field}
                                        errorMessage='Document type is required'
                                        isRequired
                                        label='Choose the document type'
                                        list={documentList}
                                        onChange={handleChange}
                                        onSelect={handleSelect}
                                        variant='prompt'
                                    />
                                ),
                            }}
                        </ResponsiveWrapper>
                    )}
                </Field>
                {values?.document_type?.id !== IDV_NOT_APPLICABLE_OPTION.value && (
                    <Field name='document_number'>
                        {({ field, meta }: FieldProps) => (
                            <WalletTextField
                                {...field}
                                disabled={!values.document_type.id}
                                errorMessage={errors.document_number}
                                isInvalid={Boolean(values.document_type.id) && meta.touched && Boolean(meta.error)}
                                label='Enter your document number'
                                onChange={handleChange}
                            />
                        )}
                    </Field>
                )}
                {values.document_type.additional?.display_name && (
                    <Field name='document_additional'>
                        {({ field, meta }: FieldProps) => (
                            <WalletTextField
                                {...field}
                                disabled={!values.document_type.additional}
                                errorMessage={errors.document_additional}
                                isInvalid={Boolean(meta.value) && meta.touched && Boolean(meta.error)}
                                label='Enter additional document number'
                                onChange={handleChange}
                            />
                        )}
                    </Field>
                )}
            </section>
            {/* [TODO]:Mock - Remove Display for form values */}
            <section>
                <p>Document Type: {values.document_type.text}</p>
                <p>Document Number: {values.document_number}</p>
                <p>Additional Document number: {values.document_additional ?? '--'} </p>
            </section>
        </Fragment>
    );
};

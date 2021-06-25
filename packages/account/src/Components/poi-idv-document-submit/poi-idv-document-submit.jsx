import React from 'react';
import { Autocomplete, Button, DesktopWrapper, Input, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { Formik, Field } from 'formik';
import { localize } from '@deriv/translations';
import { WS } from '@deriv/shared';
import FormFooter from 'Components/form-footer';
import { formatInput, getDocumentData } from './utils';
import BackButtonIcon from '../../Assets/ic-poi-back-btn.svg';
import DocumentSubmitLogo from '../../Assets/ic-document-submit-icon.svg';

const IdvDocumentSubmit = ({ handleBack, handleViewComplete, selected_country }) => {
    const [document_list, setDocumentList] = React.useState([]);
    const [document_image, setDocumentImage] = React.useState(null);
    const [is_input_disable, setInputDisable] = React.useState(true);

    const document_data = selected_country.identity.services.idv.documents_supported;
    const country_code = selected_country.value;

    React.useEffect(() => {
        setDocumentList(
            Object.keys(document_data).map(i => {
                const { display_name, format } = document_data[i];
                return { id: i, text: display_name, value: format };
            })
        );
    }, [document_data]);

    const initial_form = {
        document_type: '',
        document_number: '',
    };

    const validateFields = values => {
        const errors = {};
        const { document_type, document_number } = values;

        if (!document_type) {
            errors.document_type = localize('Please select a document type.');
        } else {
            setInputDisable(false);
        }

        if (!document_number) {
            errors.document_number = localize('Please enter your document number.');
        } else {
            const selected_document = document_list.find(d => d.text === document_type);
            const format_regex = new RegExp(selected_document.value);
            if (!format_regex.test(document_number)) {
                errors.document_number = localize(
                    `Please enter the correct format. Example: ${
                        getDocumentData(country_code, selected_document.id).example_format
                    }`
                );
            }
        }

        return errors;
    };

    const getSampleImage = document_name => {
        const selected_document = document_list.find(d => d.text === document_name);
        const { sample_image } = getDocumentData(country_code, selected_document.id);
        return sample_image;
    };

    const submitHandler = async (values, { setSubmitting, setStatus }) => {
        setSubmitting(true);
        const { document_number, document_type } = values;
        const submit_data = {
            identity_verification_document_add: 1,
            document_number,
            document_type,
            issuing_country: country_code,
        };

        WS.send(submit_data).then(response => {
            if (response.error) {
                setStatus(response.error);
            }
            setSubmitting(false);
            handleViewComplete();
        });
    };

    return (
        <Formik initialValues={initial_form} validate={validateFields} onSubmit={submitHandler}>
            {({
                dirty,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                isValid,
                setFieldValue,
                touched,
                values,
            }) => (
                <div className='proof-of-identity__container'>
                    <DocumentSubmitLogo className='icon btm-spacer' />
                    <Text className='proof-of-identity__header' align='center' weight='bold'>
                        {localize('Verify your identity')}
                    </Text>
                    <Text className='proof-of-identity__text btm-spacer' size='xs'>
                        {localize('Please select the document type and enter the document number.')}
                    </Text>
                    <div className='proof-of-identity__inner-container'>
                        <div className='proof-of-identity__container'>
                            <fieldset className='proof-of-identity__fieldset'>
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
                                                        value={values.document_type}
                                                        onChange={handleChange}
                                                        onItemSelection={({ text }) => {
                                                            setFieldValue('document_type', text || '', true);
                                                            setDocumentImage(getSampleImage(text) || null);
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
                                                    value={values.document_type}
                                                    onChange={e => {
                                                        handleChange(e);
                                                        setFieldValue('document_type', e.target.value, true);
                                                        setDocumentImage(getSampleImage(e.target.value) || null);
                                                    }}
                                                    use_text={true}
                                                    required
                                                />
                                            </MobileWrapper>
                                        </React.Fragment>
                                    )}
                                </Field>
                            </fieldset>
                            <fieldset className='proof-of-identity__fieldset-input'>
                                <Field name='document_number'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            name='document_number'
                                            disabled={is_input_disable}
                                            error={touched.document_number && errors.document_number}
                                            autoComplete='off'
                                            placeholder='Enter your document number'
                                            value={values.document_number}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            onKeyUp={e => {
                                                const selected_document = document_list.find(
                                                    d => d.text === values.document_type
                                                );
                                                const formatted_input = formatInput(
                                                    getDocumentData(country_code, selected_document.id).example_format,
                                                    e.target.value,
                                                    '-'
                                                );
                                                setFieldValue('document_number', formatted_input, true);
                                            }}
                                            required
                                        />
                                    )}
                                </Field>
                            </fieldset>
                        </div>
                        {document_image && (
                            <div className='proof-of-identity__sample-container'>
                                <Text weight='bold'>{localize('Sample:')}</Text>
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
                    <FormFooter className='proof-of-identity__footer'>
                        <Button className='back-btn' onClick={handleBack} type='button' has_effect large secondary>
                            <BackButtonIcon className='back-btn' /> {localize('Go Back')}
                        </Button>
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            onClick={handleSubmit}
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid}
                            text={localize('Next')}
                            large
                            primary
                        />
                    </FormFooter>
                </div>
            )}
        </Formik>
    );
};

export default IdvDocumentSubmit;

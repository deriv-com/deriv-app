import React from 'react';
import cn from 'classnames';
import { Formik, Field } from 'formik';
import { localize } from '@deriv/translations';
import { isMobile, supported_filetypes, max_document_size } from '@deriv/shared';
import { Button, DatePicker, Input, Icon, Text, FileDropzone } from '@deriv/components';
import './card-details.scss';

const root_class = 'manual-poi-details';

const footer_items = [
    {
        icon: 'IcPoiClearPhoto',
        text: localize('A clear colour photo or scanned image'),
    },
    {
        icon: 'IcPoiFileFormat',
        text: localize('JPEG, JPG, PNG, PDF, or GIF'),
    },
    {
        icon: 'IcPoiFileSize',
        text: localize('Less than 8MB'),
    },
    {
        icon: 'IcPoiDocExpiry',
        text: localize('Must be valid for at least 6 months'),
    },
];

const InputField = ({ data }) => {
    switch (data.type) {
        case 'text':
            return (
                <Field name={data.name}>
                    {({ field, form: { errors, touched } }) => (
                        <Input
                            {...field}
                            className={`${root_class}__field`}
                            type='text'
                            label={data.label}
                            error={touched[field.name] && errors[field.name]}
                        />
                    )}
                </Field>
            );
        case 'date':
            return (
                <Field name={data.name}>
                    {({ field, form: { errors, touched } }) => (
                        <DatePicker
                            {...field}
                            className={`${root_class}__field`}
                            date_format='YYYY-MM-DD'
                            display_format='DD MMM YYYY'
                            name={data.name}
                            label={data.label}
                            error={touched[field.name] && errors[field.name]}
                            value={field.value ? field.value.format('DD MMM YYYY') : ''}
                            readOnly
                        />
                    )}
                </Field>
            );
        default:
            return null;
    }
};

const FooterItem = ({ data }) => (
    <div className={`${root_class}__footer-item`}>
        <Icon icon={data.icon} size={24} />
        <Text as='p' size='xxxs' weight='bold' align='center'>
            {data.text}
        </Text>
    </div>
);

const DROPZONE_ERRORS = {
    'file-too-large': localize('File size should be 8MB or less'),
    'file-invalid-type': localize('File uploaded is not supported'),
    'too-many-files': localize('Please select one file only'),
    GENERAL: localize('Sorry, an error occured. Please select another file.'),
};

const Uploader = ({ data, value, is_full }) => {
    const Message = open => (
        <div className={`${root_class}__uploader-details`}>
            <Icon className={`${root_class}__uploader-icon`} icon={data.icon} size={236} />
            <Text as='p' size='xs' color='general' align='center'>
                {data.info}
            </Text>
            <Button
                medium
                secondary
                text={isMobile() ? localize('Tap here to upload') : localize('Drop file or click here to upload')}
                onClick={open}
            />
        </div>
    );

    const Preview = setFieldValue => {
        if (!value) {
            return null;
        }
        const background_url = value.file ? URL.createObjectURL(value.file) : '';

        return (
            <div className={`${root_class}__uploader-details ${root_class}__uploader-details--preview`}>
                <div className={`${root_class}__uploader-image`} style={{ backgroundImage: `url(${background_url})` }}>
                    {(!background_url || value.file.type.indexOf('pdf') !== -1) && (
                        <React.Fragment>
                            <Icon icon='IcCloudUpload' size={50} />
                            <Text as='p' size='xs' color='general' align='center'>
                                {value.file.name}
                            </Text>
                        </React.Fragment>
                    )}
                    <Icon
                        icon='IcCloseCircle'
                        className={`${root_class}__uploader-remove`}
                        onClick={() => setFieldValue(data.name, null)}
                        size={16}
                    />
                </div>
                <Text as='p' size='xs' color='general' align='center'>
                    {data.info}
                </Text>
            </div>
        );
    };
    const handleAccepte = (files, setFieldValue) => {
        setFieldValue(data.name, { file: files[0], errors: [] });
    };
    const handleRejecte = (files, setFieldValue) => {
        const errors = files[0].errors.map(error =>
            DROPZONE_ERRORS[error.code] ? DROPZONE_ERRORS[error.code] : DROPZONE_ERRORS.GENERAL
        );
        setFieldValue(data.name, { ...files[0], errors });
    };

    const ValidationErrorMessage = open => (
        <div className={`${root_class}__uploader-details`}>
            {value.errors.map((error, index) => (
                <Text key={index} as='p' size='xs' color='secondary' align='center'>
                    {error}
                </Text>
            ))}
            <Button
                medium
                secondary
                text={isMobile() ? localize('Tap here to upload') : localize('Drop file or click here to upload')}
                onClick={open}
            />
        </div>
    );

    return (
        <Field name={data.name}>
            {({ form: { setFieldValue } }) => (
                <div
                    className={cn(`${root_class}__uploader`, {
                        [`${root_class}__uploader--full`]: is_full,
                    })}
                >
                    <FileDropzone
                        accept={supported_filetypes}
                        error_message={localize('Please upload supported file type.')}
                        filename_limit={32}
                        hover_message={localize('Drop files here..')}
                        max_size={max_document_size}
                        message={Message}
                        preview_single={Preview(setFieldValue)}
                        multiple={false}
                        onDropAccepted={files => handleAccepte(files, setFieldValue)}
                        onDropRejected={files => handleRejecte(files, setFieldValue)}
                        validation_error_message={value?.errors?.length ? ValidationErrorMessage : null}
                        noClick
                        value={value ? [value] : []}
                    />
                </div>
            )}
        </Field>
    );
};

const setInitialValues = fields => {
    const values = {};
    fields.forEach(field => {
        values[field.name] = '';
    });
    return values;
};

const checkIsEmpty = value => {
    return typeof value === 'string' ? !value.trim() : !value;
};

const CardDetails = ({ data, goToCards }) => {
    const { fields, documents_title, documents } = data;

    const fields_title = localize('First, enter your {{label}} and the expiry date.', {
        label: fields[0].label.toLowerCase(),
    });

    const goBack = () => {
        goToCards();
    };

    const validateFields = values => {
        const errors = {};

        fields.forEach(field => {
            const { name, label, type } = field;
            const value = values[name];

            if (field.required && checkIsEmpty(value)) {
                errors[name] = localize('{{label}} is required.', {
                    label,
                });
            } else if (type === 'text' && !/^[\w\s-]{0,30}$/g.test(value)) {
                errors[name] = localize(
                    'Only letters, numbers, space, underscore, and hyphen are allowed for {{label}}.',
                    {
                        label,
                    }
                );
            }
        });

        return errors;
    };

    return (
        <div
            className={cn(root_class, {
                [`${root_class}--mobile`]: isMobile(),
            })}
        >
            <Formik initialValues={setInitialValues([...fields, ...documents])} validate={validateFields}>
                {({
                    values,
                    errors,
                    isValid,
                    dirty,
                    handleChange,
                    handleBlur,
                    isSubmitting,
                    handleSubmit,
                    setFieldValue,
                }) => (
                    <React.Fragment>
                        <Text as='h3' size='s' weight='bold' color='prominent'>
                            {fields_title}
                        </Text>
                        <div className={`${root_class}__fields-wrap`}>
                            {fields.map(field => (
                                <InputField key={field.name} data={field} />
                            ))}
                        </div>
                        <div className={`${root_class}__divider`} />
                        <Text as='h3' size='s' weight='bold' color='prominent'>
                            {documents_title}
                        </Text>
                        <div className={`${root_class}__uploaders-wrap`}>
                            {documents.map(item => (
                                <Uploader
                                    key={item.name}
                                    data={item}
                                    value={values[item.name]}
                                    is_full={documents.length === 1}
                                />
                            ))}
                        </div>
                        <div className={`${root_class}__footer`}>
                            {footer_items.map(item => (
                                <FooterItem key={item.icon} data={item} />
                            ))}
                        </div>
                        <div className={`${root_class}__divider ${root_class}__divider--m16`} />
                        <div className={`${root_class}__btns`}>
                            <Button onClick={goBack} secondary large text={localize('Go back')} />
                            <Button onClick={() => {}} primary large is_disabled={true} text={localize('Next')} />
                        </div>
                    </React.Fragment>
                )}
            </Formik>
        </div>
    );
};

export default CardDetails;

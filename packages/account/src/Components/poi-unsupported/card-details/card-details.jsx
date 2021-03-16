import React from 'react';
import cn from 'classnames';
import { Formik, Field } from 'formik';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { Button, DatePicker, Input, Icon, Text } from '@deriv/components';
import FileUploader from 'Components/file-uploader-container/file-uploader.jsx';
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

const getImage = data => {
    const isValid = data.files?.length || data.files?.length === 1 || !data.error_message;
    return isValid ? URL.createObjectURL(data.files[0]) : '';
};

const Uploader = ({ data, is_full }) => {
    const ref = React.useRef();
    const [file, setFile] = React.useState();
    const Message = (
        <div className={`${root_class}__uploader-details`}>
            <Icon className={`${root_class}__uploader-icon`} icon={data.icon} size={236} />
            <Text as='p' size='xs' color='general' align='center'>
                {data.info}
            </Text>
            <Button
                medium
                secondary
                text={isMobile() ? localize('Tap here to upload') : localize('Drop file or click here to upload')}
            />
        </div>
    );

    const Preview = (
        <div className={`${root_class}__uploader-details ${root_class}__uploader-details--preview`}>
            <div
                className={`${root_class}__uploader-image`}
                style={{ backgroundImage: `url(${file ? getImage(file) : ''})` }}
            >
                <Icon
                    icon='IcCloseCircle'
                    className={`${root_class}__uploader-remove`}
                    onClick={() => setFile(null)}
                    size={16}
                    color='secondary'
                />
            </div>
            <Text as='p' size='xs' color='general' align='center'>
                {data.info}
            </Text>
        </div>
    );

    return (
        <Field name={data.name}>
            {({ field }) => (
                <div
                    className={cn(`${root_class}__uploader`, {
                        [`${root_class}__uploader--full`]: is_full,
                    })}
                >
                    <input type='hidden' {...field} />
                    <FileUploader
                        ref={ref}
                        onFileDrop={droped_file => setFile(droped_file)}
                        message={Message}
                        preview_single={Preview}
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
                                    onChange={handleChange}
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

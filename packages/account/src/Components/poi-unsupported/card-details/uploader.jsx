import React from 'react';
import cn from 'classnames';
import PropTypes, { string } from 'prop-types';
import { Field } from 'formik';
import { localize } from '@deriv/translations';
import { isMobile, supported_filetypes, max_document_size } from '@deriv/shared';
import { Button, Icon, Text, FileDropzone } from '@deriv/components';
import { ROOT_CLASS } from '../constants';

const DROPZONE_ERRORS = {
    'file-too-large': localize('File size should be 8MB or less'),
    'file-invalid-type': localize('File uploaded is not supported'),
    'too-many-files': localize('Please select one file only'),
    GENERAL: localize('Sorry, an error occured. Please select another file.'),
};

const Uploader = ({ data, value, is_full }) => {
    const Message = open => (
        <div className={`${ROOT_CLASS}__uploader-details`}>
            <Icon className={`${ROOT_CLASS}__uploader-icon`} icon={data.icon} size={236} />
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
            <div className={`${ROOT_CLASS}__uploader-details ${ROOT_CLASS}__uploader-details--preview`}>
                <div className={`${ROOT_CLASS}__uploader-image`} style={{ backgroundImage: `url(${background_url})` }}>
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
                        className={`${ROOT_CLASS}__uploader-remove`}
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
        <div className={`${ROOT_CLASS}__uploader-details`}>
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
                    className={cn(`${ROOT_CLASS}__uploader`, {
                        [`${ROOT_CLASS}__uploader--full`]: is_full,
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

Uploader.propTypes = {
    data: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes, string]),
    is_full: PropTypes.bool,
};
export default Uploader;

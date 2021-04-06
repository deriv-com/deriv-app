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

const Uploader = ({ data, value, is_full, onChange, has_frame }) => {
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
                <div
                    className={cn(`${ROOT_CLASS}__uploader-image`, {
                        [`${ROOT_CLASS}__uploader-image--has-frame`]: has_frame,
                    })}
                    style={{ backgroundImage: `url(${background_url})` }}
                >
                    {has_frame && <Icon icon='IcPoiFrame' className={`${ROOT_CLASS}__uploader-frame`} />}
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
                        onClick={() => handleChange(null, setFieldValue)}
                        size={16}
                    />
                </div>
                <Text as='p' size='xs' color='general' align='center'>
                    {data.info}
                </Text>
            </div>
        );
    };

    const handleChange = (file, setFieldValue) => {
        if (onChange && typeof onChange === 'function') {
            onChange(file);
        }
        setFieldValue(data.name, file);
    };

    const handleAccepte = (files, setFieldValue) => {
        const file = { file: files[0], errors: [], ...data };
        handleChange(file, setFieldValue);
    };

    const handleRejecte = (files, setFieldValue) => {
        const errors = files[0].errors.map(error =>
            DROPZONE_ERRORS[error.code] ? DROPZONE_ERRORS[error.code] : DROPZONE_ERRORS.GENERAL
        );
        const file = { ...files[0], errors, ...data };
        handleChange(file, setFieldValue);
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
    has_frame: PropTypes.bool,
    onChange: PropTypes.func,
};
export default Uploader;

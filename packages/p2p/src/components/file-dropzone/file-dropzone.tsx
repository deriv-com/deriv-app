import React from 'react';
import classNames from 'classnames';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import { Text } from '@deriv/components';
import { TFileDropzone } from 'Types';
import { truncateFileName } from 'Utils/file-uploader';
import FadeInMessage from './fade-in-message';
import PreviewSingle from './preview-single';

const FileDropzone = ({ className, noClick = false, ...props }: TFileDropzone) => {
    const {
        accept,
        error_message,
        filename_limit,
        hover_message,
        max_size,
        message,
        multiple,
        onDropAccepted,
        onDropRejected,
        validation_error_message,
        value,
    } = props;

    const RenderErrorMessage = React.useCallback(
        ({ open }: DropzoneRef) => {
            if (noClick && typeof message === 'function') return <>{message(open)}</>;

            return <>{message}</>;
        },
        [message, noClick]
    );

    const RenderValidationErrorMessage = React.useCallback(
        ({ open }: DropzoneRef) => {
            if (typeof validation_error_message === 'function') return <>{validation_error_message(open)}</>;

            return <>{validation_error_message}</>;
        },
        [validation_error_message]
    );

    const dropzone_ref = React.useRef(null);

    return (
        <Dropzone
            // accept prop is same as native HTML5 input accept - e.g - 'image/png'
            accept={accept}
            // set maximum size limit for file, in bytes (binary)
            maxSize={max_size}
            // allow multiple uploads
            multiple={multiple || false}
            // sends back accepted files array
            onDropAccepted={onDropAccepted}
            // sends back rejected files array
            onDropRejected={onDropRejected}
            noClick={noClick}
        >
            {({ getRootProps, getInputProps, isDragAccept, isDragActive, isDragReject, open }) => (
                <div
                    {...getRootProps()}
                    className={classNames('file-dropzone', className, {
                        'file-dropzone--is-active': isDragActive,
                        'file-dropzone--has-file': isDragActive || value.length > 0,
                        'file-dropzone--has-error': (isDragReject || !!validation_error_message) && !isDragAccept,
                        'file-dropzone--is-noclick': noClick,
                    })}
                    ref={dropzone_ref}
                >
                    <input {...getInputProps()} data-testid='dt_file_upload_input' />
                    <div className='file-dropzone__content'>
                        <FadeInMessage
                            // default message when not on hover or onDrag
                            is_visible={!isDragActive && !!message && value.length < 1 && !validation_error_message}
                            timeout={150}
                            no_text={noClick}
                        >
                            <RenderErrorMessage open={open} />
                        </FadeInMessage>
                        <FadeInMessage
                            // message shown on hover if files are accepted onDrag
                            is_visible={isDragActive && !isDragReject}
                            timeout={150}
                        >
                            {hover_message}
                        </FadeInMessage>
                        {/* Handle cases for displaying multiple files and single filenames */}
                        {multiple && value.length > 0 && !validation_error_message
                            ? value.map((file, idx) => (
                                  <Text
                                      size='xxs'
                                      weight='bold'
                                      align='center'
                                      key={file.name}
                                      className='file-dropzone__filename'
                                  >
                                      {filename_limit ? truncateFileName(file, filename_limit) : file.name}
                                  </Text>
                              ))
                            : value[0] &&
                              !isDragActive &&
                              !validation_error_message && <PreviewSingle dropzone_ref={dropzone_ref} {...props} />}
                        <FadeInMessage
                            // message shown if there are errors with the dragged file
                            is_visible={isDragReject}
                            timeout={150}
                            color='loss-danger'
                        >
                            {error_message}
                        </FadeInMessage>
                        <FadeInMessage
                            // message shown on if there are validation errors with file uploaded
                            is_visible={!!validation_error_message && !isDragActive}
                            timeout={150}
                            color='loss-danger'
                        >
                            <RenderValidationErrorMessage open={open} />
                        </FadeInMessage>
                    </div>
                </div>
            )}
        </Dropzone>
    );
};

export default FileDropzone;

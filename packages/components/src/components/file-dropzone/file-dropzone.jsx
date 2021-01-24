import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Dropzone from 'react-dropzone';
import { truncateFileName } from '@deriv/shared';
import Text from '../text';

const FadeInMessage = ({ is_visible, children, key, timeout }) => (
    <CSSTransition
        appear
        key={key}
        in={is_visible}
        timeout={timeout}
        classNames={{
            appear: 'dc-file-dropzone__message--enter',
            enter: 'dc-file-dropzone__message--enter',
            enterActive: 'dc-file-dropzone__message--enter-active',
            enterDone: 'dc-file-dropzone__message--enter-done',
            exit: 'dc-file-dropzone__message--exit',
            exitActive: 'dc-file-dropzone__message--exit-active',
        }}
        unmountOnExit
    >
        {children}
    </CSSTransition>
);

const FileDropzone = ({ className, ...props }) => (
    <Dropzone
        // sends back accepted files array
        onDropAccepted={props.onDropAccepted}
        // sends back rejected files array
        onDropRejected={props.onDropRejected}
        // allow multiple uploads
        multiple={props.multiple || false}
        // accept prop is same as native HTML5 input accept - e.g - 'image/png'
        accept={props.accept}
        // set maximum size limit for file, in bytes (binary)
        maxSize={props.max_size}
    >
        {({ getRootProps, getInputProps, isDragAccept, isDragActive, isDragReject }) => {
            return (
                <div
                    {...getRootProps()}
                    className={classNames('dc-file-dropzone', className, {
                        'dc-file-dropzone--is-active': isDragActive,
                        'dc-file-dropzone--has-file': isDragActive || props.value.length > 0,
                        'dc-file-dropzone--has-error':
                            (isDragReject || !!props.validation_error_message) && !isDragAccept,
                    })}
                >
                    <input {...getInputProps()} />
                    <div className='dc-file-dropzone__content'>
                        <FadeInMessage
                            // default message when not on hover or onDrag
                            is_visible={
                                !isDragActive &&
                                !!props.message &&
                                props.value.length < 1 &&
                                !props.validation_error_message
                            }
                            timeout={150}
                        >
                            <div className='dc-file-dropzone__message'>{props.message}</div>
                        </FadeInMessage>
                        <FadeInMessage
                            // message shown on hover if files are accepted onDrag
                            is_visible={isDragActive && !isDragReject}
                            timeout={150}
                        >
                            <div className='dc-file-dropzone__message'>{props.hover_message}</div>
                        </FadeInMessage>
                        {/* Handle cases for displaying multiple files and single filenames */}

                        {props.multiple && props.value.length > 0 && !props.validation_error_message
                            ? props.value.map((file, idx) => (
                                  <Text
                                      size='xxs'
                                      weight='bold'
                                      align='center'
                                      key={idx}
                                      className='dc-file-dropzone__filename'
                                  >
                                      {props.filename_limit ? truncateFileName(file, props.filename_limit) : file.name}
                                  </Text>
                              ))
                            : props.value[0] &&
                              !isDragActive && (
                                  <Text size='xxs' weight='bold' align='center' className='dc-file-dropzone__filename'>
                                      {props.filename_limit
                                          ? truncateFileName(props.value[0], props.filename_limit)
                                          : props.value[0].name}
                                  </Text>
                              )}
                        <FadeInMessage
                            // message shown if there are errors with the dragged file
                            is_visible={isDragReject}
                            timeout={150}
                        >
                            <div
                                className={classNames('dc-file-dropzone__message', 'dc-file-dropzone__message--error')}
                            >
                                {props.error_message}
                            </div>
                        </FadeInMessage>
                        <FadeInMessage
                            // message shown on if there are validation errors with file uploaded
                            is_visible={!!props.validation_error_message && !isDragActive}
                            timeout={150}
                        >
                            <div
                                className={classNames('dc-file-dropzone__message', 'dc-file-dropzone__message--error')}
                            >
                                {props.validation_error_message}
                            </div>
                        </FadeInMessage>
                    </div>
                </div>
            );
        }}
    </Dropzone>
);

export default FileDropzone;

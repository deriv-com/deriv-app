import classNames        from 'classnames';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import Dropzone          from 'react-dropzone';
import                        './file-dropzone.scss';

const FadeInMessage = ({ is_visible, children, key, timeout }) => (
    <CSSTransition
        appear
        key={key}
        in={is_visible}
        timeout={timeout}
        classNames={{
            appear     : 'dc-file-dropzone__message--enter',
            enter      : 'dc-file-dropzone__message--enter',
            enterActive: 'dc-file-dropzone__message--enter-active',
            enterDone  : 'dc-file-dropzone__message--enter-done',
            exit       : 'dc-file-dropzone__message--exit',
            exitActive : 'dc-file-dropzone__message--exit-active',
        }}
        unmountOnExit
    >
        {children}
    </CSSTransition>
);

const FileDropzone = ({ className, ...props }) => (
    <Dropzone
        onDrop={props.onDrop}
        multiple={props.multiple}
        accept={props.accept}
        maxSize={props.max_size}
    >
        {({ getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
            const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > props.max_size;
            return (
                <div
                    {...getRootProps()}
                    className={classNames('dc-file-dropzone', className, {
                        'dc-file-dropzone--is-active': isDragActive,
                        'dc-file-dropzone--has-file' : (acceptedFiles.length > 0),
                        'dc-file-dropzone--has-error': (isDragReject || (rejectedFiles.length > 0)),
                    })}
                >
                    <input {...getInputProps()} />
                    <div className='dc-file-dropzone__content'>
                        <FadeInMessage
                            // default message when not on hover or onDrag
                            is_visible={
                                (!isDragActive && props.message &&
                                  (acceptedFiles.length < 1) && (rejectedFiles.length < 1))
                            }
                            timeout={150}
                        >
                            <div className='dc-file-dropzone__message'>
                                {props.message}
                            </div>
                        </FadeInMessage>
                        <FadeInMessage
                            // message shown on hover if files are accepted onDrag
                            is_visible={(isDragActive && !isDragReject)}
                            timeout={150}
                        >
                            <div className='dc-file-dropzone__message'>
                                {props.hover_message}
                            </div>
                        </FadeInMessage>
                        {props.multiple && (acceptedFiles.length > 0) ?
                            acceptedFiles.map((item, idx) =>
                                <span key={idx} className='dc-file-dropzone__filename'>{item.name}</span>
                            )
                            :
                            (acceptedFiles[0] && !isDragActive) &&
                                <span className='dc-file-dropzone__filename'>
                                    {acceptedFiles[0].name}
                                </span>
                        }
                        {props.multiple && (rejectedFiles.length > 0) ?
                            rejectedFiles.map((item, idx) =>
                                <span key={idx} className='dc-file-dropzone__filename'>{item.name}</span>
                            )
                            :
                            (rejectedFiles[0] && !isDragActive) &&
                                <span className='dc-file-dropzone__filename'>
                                    {rejectedFiles[0].name}
                                </span>
                        }
                        <FadeInMessage
                            // message shown on hover if files are rejected onDrag
                            is_visible={(isDragReject || ((rejectedFiles.length > 0) && !isFileTooLarge))}
                            timeout={150}
                        >
                            <div className='dc-file-dropzone__message'>
                                {props.error_message_type}
                            </div>
                        </FadeInMessage>
                        <FadeInMessage
                            // message shown on hover if files are rejected onDrag
                            is_visible={isFileTooLarge}
                            timeout={150}
                        >
                            <div className='dc-file-dropzone__message'>
                                {props.error_message_size}
                            </div>
                        </FadeInMessage>
                    </div>
                </div>
            );
        }}
    </Dropzone>
);

export default FileDropzone;

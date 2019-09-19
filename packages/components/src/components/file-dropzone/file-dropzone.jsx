import classNames        from 'classnames';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import Dropzone          from 'react-dropzone';
import                        './file-dropzone.scss';

const FadeInMessage = ({ is_visible, classes, children, key, timeout }) => (
    <CSSTransition
        appear
        key={key}
        in={is_visible}
        timeout={timeout}
        classNames={classes}
        unmountOnExit
    >
        {children}
    </CSSTransition>
);

// TODO: Clean up unnecessary transition class states
const message_classnames = {
    appear     : 'dc-file-dropzone__message--enter',
    enter      : 'dc-file-dropzone__message--enter',
    enterActive: 'dc-file-dropzone__message--enter-active',
    enterDone  : 'dc-file-dropzone__message--enter-done',
    exit       : 'dc-file-dropzone__message--exit',
    exitActive : 'dc-file-dropzone__message--exit-active',
};

const FileDropzone = ({ className, ...props }) => (
    <Dropzone
        onDrop={props.onDrop}
        multiple={props.multiple}
        accept={props.accept}
        minSize={props.min_size}
        maxSize={props.max_size}
    >
        {({ getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles }) => {
            return (
                <div
                    {...getRootProps()}
                    className={classNames('dc-file-dropzone', className, {
                        'dc-file-dropzone--is-active': isDragActive,
                        'dc-file-dropzone--has-file' : (acceptedFiles.length > 0),
                    })}
                >
                    <input {...getInputProps()} />
                    <div className='dc-file-dropzone__content'>
                        <FadeInMessage
                            classes={message_classnames}
                            // default message when not on hover or onDrag
                            is_visible={(!isDragActive && props.message && (acceptedFiles.length < 1))}
                            timeout={150}
                        >
                            <div className='dc-file-dropzone__message'>
                                {props.message}
                            </div>
                        </FadeInMessage>
                        <FadeInMessage
                            classes={message_classnames}
                            // message shown on hover if files are accepted onDrag
                            is_visible={(isDragActive && !isDragReject)}
                            timeout={150}
                        >
                            <div className='dc-file-dropzone__message'>
                                {props.hover_message}
                            </div>
                        </FadeInMessage>
                        <FadeInMessage
                            classes={message_classnames}
                            // message shown on hover if files are rejected onDrag
                            is_visible={isDragReject}
                            timeout={150}
                        >
                            <div className='dc-file-dropzone__message'>
                                {props.error_message}
                            </div>
                        </FadeInMessage>
                        {props.multiple && (acceptedFiles.length > 0) ?
                            acceptedFiles.map((item, idx) =>
                                <span key={idx} className='dc-file-dropzone__filename'>{item.name}</span>
                            )
                            :
                            acceptedFiles[0] && (!isDragReject || !isDragActive) &&
                                <span className='dc-file-dropzone__filename'>{acceptedFiles[0].name}</span>
                        }
                    </div>
                </div>
            );
        }}
    </Dropzone>
);

export default FileDropzone;

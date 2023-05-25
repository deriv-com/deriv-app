import React from 'react';
import PropTypes from 'prop-types';
import { FileDropzone, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';

const FileUploaderComponent = ({
    accept,
    hover_message,
    max_size,
    multiple = false,
    onClickClose,
    onDropAccepted,
    onDropRejected,
    upload_message,
    validation_error_message,
    value,
}) => {
    const getUploadMessage = () => {
        return (
            <>
                <Icon icon='IcCloudUpload' size={50} />
                <Text as='div' line-height={isMobile() ? 'xl' : 'l'} size={isMobile() ? 'xxs' : 'xs'} weight='bold'>
                    {upload_message}
                </Text>
            </>
        );
    };

    return (
        <div className='file-uploader-component'>
            <FileDropzone
                accept={accept}
                error_message={localize('Please upload supported file type.')}
                filename_limit={26}
                hover_message={hover_message}
                max_size={max_size}
                message={getUploadMessage()}
                multiple={multiple}
                onDropAccepted={onDropAccepted}
                onDropRejected={onDropRejected}
                validation_error_message={validation_error_message}
                value={value}
            />
            {(value.length > 0 || !!validation_error_message) && (
                <Icon
                    icon='IcCloseCircle'
                    className={'file-uploader-component__close-icon'}
                    onClick={onClickClose}
                    color='secondary'
                    data_testid='dt_remove_file_icon'
                />
            )}
        </div>
    );
};

FileUploaderComponent.propTypes = {
    accept: PropTypes.string,
    hover_message: PropTypes.string,
    error_messages: PropTypes.string,
    max_size: PropTypes.number,
    multiple: PropTypes.bool,
    upload_message: PropTypes.string,
    onClickClose: PropTypes.func,
    onDropAccepted: PropTypes.func,
    onDropRejected: PropTypes.func,
    validation_error_message: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.instanceOf(File)),
};

export default FileUploaderComponent;

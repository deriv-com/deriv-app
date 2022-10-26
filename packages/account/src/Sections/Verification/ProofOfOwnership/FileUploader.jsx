import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Input, Icon } from '@deriv/components';
import classNames from 'classnames';
import { compressImageFiles } from '@deriv/shared';

const FileUploader = ({
    class_name,
    data_test_id,
    error,
    file_name,
    handleFile,
    index,
    name,
    show_browse_button,
    sub_index,
    updateErrors,
    updateShowBrowseButton,
    validateField,
}) => {
    // Create a reference to the hidden file input element
    const hidden_file_input = React.useRef(null);
    const handleClick = e => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        hidden_file_input.current.click();
    };

    const handleChange = async event => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        const files_to_upload = await compressImageFiles([...event.target.files]);
        handleFile(name, files_to_upload[0]);
        updateShowBrowseButton(sub_index, !show_browse_button);
    };
    const handleIconClick = e => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        updateShowBrowseButton(sub_index, !show_browse_button);
        hidden_file_input.current.value = '';
        handleFile(name, '');
        updateErrors(index, sub_index);
        validateField('files');
    };
    return (
        <div className={`file-uploader ${class_name}`}>
            <input
                type='file'
                accept='image/png, image/jpeg, image/jpg, application/pdf'
                ref={hidden_file_input}
                onChange={handleChange}
                className='hidden-input'
                data-testid={data_test_id}
                name={name}
            />
            <Input
                name='cardImgName'
                required
                label={localize('Choose a photo')}
                maxLength={255}
                hint={localize('Accepted formats: pdf, jpeg, jpg, and png. Max file size: 8MB')}
                value={file_name}
                readOnly
                color='less-prominent'
                type={'text'}
                tabIndex={'-1'}
                error={error}
                trailing_icon={
                    <Icon
                        onClick={handleIconClick}
                        icon='IcCross'
                        height='100%'
                        className={classNames('stack-top ', {
                            'remove-element': show_browse_button,
                        })}
                    />
                }
            />
            <Button
                className={classNames('proof-of-ownership__card-open-inputs-photo-btn ', {
                    'remove-element': !show_browse_button,
                })}
                text={localize('Browse')}
                onClick={handleClick}
                primary
            />
        </div>
    );
};
export default FileUploader;

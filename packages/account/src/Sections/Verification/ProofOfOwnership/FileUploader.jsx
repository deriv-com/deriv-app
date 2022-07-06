import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Input, Icon } from '@deriv/components';
import classNames from 'classnames';

const FileUploader = ({
    handleFile,
    file_name,
    class_name,
    data_test_id,
    name,
    error,
    validateField,
    disableSubmitButton,
    index,
    sub_index,
    updateErrors,
}) => {
    // Create a reference to the hidden file input element
    const hidden_file_input = React.useRef(null);
    const [show_button, setShowButton] = React.useState(true);

    const handleClick = e => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        hidden_file_input.current.click();
    };

    const handleChange = event => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        const fileUploaded = event.target.files[0];
        handleFile(name, fileUploaded);
        setShowButton(!show_button);
    };
    const handleIconClick = e => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setShowButton(!show_button);
        e.target.parentElement.parentElement.parentElement.querySelector(`input[name="${name}"]`).value = '';
        e.target.parentElement.parentElement.querySelector(`input[type="text"]`).value = '';
        handleFile(name, '');
        updateErrors(index, sub_index);
        validateField('files');
        disableSubmitButton();
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
                        color='black'
                        height='100%'
                        className={classNames('stack-top ', {
                            'remove-element': show_button,
                        })}
                    />
                }
            />
            <Button
                className={classNames('proof-of-ownership__card-open-inputs-photo-btn ', {
                    'remove-element': !show_button,
                })}
                text={localize('Browse')}
                onClick={handleClick}
                primary
            />
        </div>
    );
};
export default FileUploader;

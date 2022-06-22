import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Input, Icon } from '@deriv/components';

const FileUploader = ({ handleFile, fileName, className, dataTestID, name, error, validateField }) => {
    // Create a reference to the hidden file input element
    const hiddenFileInput = React.useRef(null);
    const [showButton, setShowButton] = React.useState(true);

    const handleClick = e => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        hiddenFileInput.current.click();
    };

    const handleChange = event => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        const fileUploaded = event.target.files[0];
        handleFile(name, fileUploaded);
        setShowButton(!showButton);
    };
    const handleIconClick = e => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setShowButton(!showButton);
        e.target.parentElement.parentElement.parentElement.querySelector(`input[name="${name}"]`).value = '';
        e.target.parentElement.parentElement.querySelector(`input[type="text"]`).value = '';
        handleFile(name, null);
        validateField('files');
    };
    return (
        <div className={`file-uploader ${className}`}>
            <input
                type='file'
                accept={'image/png, image/jpeg, image/jpg, image/gif, application/pdf'}
                ref={hiddenFileInput}
                onChange={handleChange}
                className='hidden-input'
                data-testid={dataTestID}
                name={name}
            />
            <Input
                name='cardImgName'
                required
                label={localize('Choose a photo')}
                maxLength={255}
                hint={localize('Accepted formats: pdf, jpeg, jpg, and png. Max file size: 8MB')}
                value={fileName}
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
                        className={`stack-top ${showButton ? 'remove-element' : ''}`}
                    />
                }
            />
            <Button
                className={`proof-of-ownership__card-open-inputs-photo-btn ${showButton ? '' : 'remove-element'}`}
                text={localize('Browse')}
                onClick={handleClick}
                primary
            />
        </div>
    );
};
export default FileUploader;

import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Input } from '@deriv/components';

const FileUploader = ({ handleFile, fileName, className, dataTestID, name, error }) => {
    // Create a reference to the hidden file input element
    const hiddenFileInput = React.useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        handleFile(name, fileUploaded);
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
            />
            <Button
                className='proof-of-ownership__card-open-inputs-photo-btn'
                text={localize('Browse')}
                onClick={handleClick}
                primary
            />
        </div>
    );
};
export default FileUploader;

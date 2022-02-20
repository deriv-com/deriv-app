import React from 'react';
import { localize } from '@deriv/translations';
import { Button, Input } from '@deriv/components';

const FileUploader = ({ handleFile, fileName }) => {
    // Create a reference to the hidden file input element
    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        handleFile(fileUploaded);
    };
    return (
        <>
            <input
                type='file'
                accept={'image/png, image/jpeg, image/jpg, image/gif, application/pdf'}
                ref={hiddenFileInput}
                onChange={handleChange}
                className='hidden-input'
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
            />
            <Button
                className='proof-of-ownership__card-open-inputs-photo-btn'
                text={localize('Browse')}
                onClick={handleClick}
                primary
            />
        </>
    );
};
export default FileUploader;

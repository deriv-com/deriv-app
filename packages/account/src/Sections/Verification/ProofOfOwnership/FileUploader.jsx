import React from 'react';
import { localize } from '@deriv/translations';
import { Button } from '@deriv/components';

const FileUploader = ({ handleFile }) => {
    // Create a reference to the hidden file input element
    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        console.log(fileUploaded);
        handleFile(fileUploaded);
    };
    return (
        <>
            <Button
                className='proof-of-ownership__card-open-inputs-photo-btn'
                text={localize('Browse')}
                onClick={handleClick}
                primary
            ></Button>
            <input
                type='file'
                accept={'image/png, image/jpeg, image/jpg, image/gif, application/pdf'}
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </>
    );
};
export default FileUploader;

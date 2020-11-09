# FileDropzone Component

A dropzone area. Client can upload files by dragging them into dropzone area


## Usage

```jsx
import FileDropzone from 'deriv-components';

const DummyComponent = props => (
    <FileDropzone
        accept={'image/png, image/jpeg, image/jpg'}
        hover_message={'Drop files here..'}
        max_size={8388608}
        multiple={false}
        value={[]}
    />
);
```

## Props


| Name                      | Type         | Default     | Description                                                          |
| ------------------------- | ------------ | ----------- | -------------------------------------------------------------------- |
| accept                    | {string}     | null        | Comma seperated string of the accepted file formats                  |
| error_message             | {string}     | null        | Message shown if there are errors with the dragged file              |
| hover_message             | {string}     | null        | Message shown on hover if files are accepted onDrag                  |
| max_size                  | {number}     | null        | Maximum size limit for file, in bytes (binary)                       |
| message                   | {string}     | null        | Default message when not on hover or onDrag                          |
| multiple                  | {boolean}    | `false`     | Allow multiple uploads                                               |
| onDropAccepted            | {function}   | null        | Function sends back accepted files array                             |
| onDropRejected            | {function}   | null        | Function sends back rejected files array                             |
| validation\_error\_message| {string}     | null        | Message shown on if there are validation errors with file uploaded   |
| value                     | [object]     | null        | Array contains the default selected files                            |



# Full example:

```jsx
import React, { useState } from 'react';
import FileDropzone from 'deriv-components';
import Icon from 'deriv-components';

const DummyComponent = props => {

    const UploadMessage = (
        <div style={{ margin: '20px' }}>
            <Icon icon='IcCloudUpload' className='dc-file-dropzone__message-icon' size={50} />
            <div className='dc-file-dropzone__message-subtitle'>
                Drop file (JPEG  JPG  PNG  PDF  GIF) or click here to upload
            </div>
        </div>
    );

    return (
        <React.Fragment>
            <FileDropzone
                accept={'image/png, image/jpeg, image/jpg, image/gif, application/pdf'}
                error_message={'Please upload supported file type.'}
                hover_message={'Drop files here..'}
                max_size={8388608}
                message={UploadMessage}
                multiple={false}
                validation_error_message={''}
                value={[]}
            />
        </React.Fragment>
    );
}
```

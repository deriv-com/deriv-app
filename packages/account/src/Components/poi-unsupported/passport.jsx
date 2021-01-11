import React from 'react';
import { localize } from '@deriv/translations';
import PreviewConfirm from './preview-confirm.jsx';
import FilePending from './file-pending.jsx';

const Passport = ({ root_class, onConfirm }) => {
    const [image_preview, setImagePreview] = React.useState(null);
    const [file, setFile] = React.useState(null);

    const getSocketFunc = () => console.log('socketFunc');
    const onFileDrop = e => {
        setFile(e.files[0]);
        setImagePreview(URL.createObjectURL(e.files[0]));
    };
    const handleConfirm = () => {
        onConfirm([file], () => {
            console.log('Showing pending dialog');
        });
    };
    const handleCancel = () => {
        setImagePreview(null);
        setFile(null);
    };

    if (!image_preview) {
        return (
            <FilePending
                title={localize('Upload the page of your passport that contains your photo')}
                icon='IcPassport'
                getSocketFunc={getSocketFunc}
                onFileDrop={onFileDrop}
                root_class={root_class}
            />
        );
    }
    return (
        <PreviewConfirm
            image_preview={image_preview}
            root_class={root_class}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            cancel_btn_text={localize('Upload a different file')}
            confirm_btn_text={localize('Confirm')}
            title={localize('Confirm your document')}
        />
    );
};

export default Passport;

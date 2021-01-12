import React from 'react';
import { localize } from '@deriv/translations';
import PreviewConfirm from './preview-confirm.jsx';
import FilePending from './file-pending.jsx';
import { DOCUMENT_TYPES } from './constants';

const Details = ({ step, root_class, onConfirm }) => {
    const [image_preview, setImagePreview] = React.useState(null);
    const [file, setFile] = React.useState(null);

    const getSocketFunc = () => console.log('socketFunc');
    const onFileDrop = e => {
        if (!e.files) {
            return;
        }
        const is_single = e.files.length === 1;
        const uploaded_file = is_single ? e.files[0] : e.files[0].file;
        setFile(uploaded_file);
        setImagePreview(URL.createObjectURL(uploaded_file));
    };
    const handleConfirm = () => {
        onConfirm({ file, document_type: step.document_type }, () => {
            setImagePreview(null);
        });
    };
    const handleCancel = () => {
        setImagePreview(null);
        setFile(null);
    };

    if (!image_preview) {
        return <FilePending {...step} getSocketFunc={getSocketFunc} onFileDrop={onFileDrop} root_class={root_class} />;
    }
    const is_selfie = step.document_type === DOCUMENT_TYPES.selfie;

    return (
        <PreviewConfirm
            image_preview={image_preview}
            root_class={root_class}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            cancel_btn_text={localize('Upload a different file')}
            confirm_btn_text={localize('Confirm')}
            title={is_selfie ? localize('Confirm your documents') : localize('Confirm your document')}
            description={step.confirm_description}
            is_selfie={is_selfie}
        />
    );
};

export default Details;

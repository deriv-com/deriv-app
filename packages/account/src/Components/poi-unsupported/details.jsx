import React from 'react';
import { localize } from '@deriv/translations';
import PreviewConfirm from './preview-confirm.jsx';
import FilePending from './file-pending.jsx';

const Details = ({ step, active_step, root_class, onConfirm }) => {
    const [image_preview, setImagePreview] = React.useState(null);
    const [file, setFile] = React.useState(null);

    const getSocketFunc = () => {};

    const onFileDrop = data => {
        if (!data.files.length || data.files.length > 1 || data.error_message) {
            return;
        }
        const file_droped = data.files[0];
        setFile(file_droped);
        setImagePreview(URL.createObjectURL(file_droped));
    };

    const handleConfirm = () => {
        const { documentType, pageType } = step;
        const file_data = {
            file,
            step: active_step,
            documentType,
            pageType,
        };

        onConfirm(file_data, () => {
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

    const is_selfie = step.documentType === 'selfie';

    return (
        <PreviewConfirm
            image_preview={image_preview}
            root_class={root_class}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            cancel_btn_text={localize('Upload a different file')}
            confirm_btn_text={localize('Confirm')}
            title={is_selfie ? localize('Confirm your documents') : localize('Confirm your document')}
            description={step.confirmDescription}
            is_selfie={is_selfie}
        />
    );
};

export default Details;

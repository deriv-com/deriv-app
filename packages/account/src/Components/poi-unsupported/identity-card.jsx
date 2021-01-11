import React from 'react';
import { localize } from '@deriv/translations';
import FilePending from './file-pending.jsx';
import PreviewConfirm from './preview-confirm.jsx';

const IdentityCard = ({ root_class, onConfirm }) => {
    const [image_preview, setImagePreview] = React.useState(null);
    const [file_list, setFileList] = React.useState([]);

    const getSocketFunc = () => console.log('socketFunc');
    const onFileDrop = e => {
        setFileList([...file_list, e.files[0]]);
        setImagePreview(URL.createObjectURL(e.files[0]));
    };
    const handleConfirmFront = () => {
        setImagePreview(null);
    };
    const handleConfirm = () => {
        onConfirm(file_list, () => {
            console.log('Showing pending dialog');
        });
    };
    const handleCancel = () => {
        setImagePreview(null);
        setFileList([]);
    };

    if (file_list.length === 0 && !image_preview) {
        return (
            <FilePending
                title={localize('Upload the front of your identity card')}
                description={localize('You’ll be asked to upload the back of your identity card next.')}
                icon='IcIdCardFront'
                getSocketFunc={getSocketFunc}
                onFileDrop={onFileDrop}
                root_class={root_class}
            />
        );
    } else if (file_list.length === 1 && image_preview) {
        return (
            <PreviewConfirm
                image_preview={image_preview}
                root_class={root_class}
                onCancel={handleCancel}
                onConfirm={handleConfirmFront}
                cancel_btn_text={localize('Upload a different file')}
                confirm_btn_text={localize('Confirm')}
                title={localize('Confirm your document')}
                description={localize('After confirming, you’ll be asked to upload the back of your identity card.')}
            />
        );
    } else if (file_list.length === 1 && !image_preview) {
    }

    return null;
};

export default IdentityCard;

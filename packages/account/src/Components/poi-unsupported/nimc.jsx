import React from 'react';
import { localize } from '@deriv/translations';
import FilePending from './file-pending.jsx';

const root_class = 'unsupported-country-poi';

const NIMC = () => {
    const getSocketFunc = () => console.log('socket func requested');
    const onFileDrop = e => {
        // TODO add proper validation for image selection
        // setImagePreview(URL.createObjectURL(e.files[0]));
        // setTempFile(e.files[0]);
    };
    return (
        <FilePending
            icon='IcPoiNimcSlipHorizontal'
            title={localize('Upload NIMC slip')}
            description={localize('You’ll be asked to upload your age declaration document next.')}
            getSocketFunc={getSocketFunc}
            onFileDrop={onFileDrop}
            root_class={root_class}
        />
    );
};

export default NIMC;

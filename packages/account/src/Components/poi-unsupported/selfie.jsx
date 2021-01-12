import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import DetailGrid from './detail-grid.jsx';
import FileUploaderContainer from '../file-uploader-container/file-uploader-container.jsx';
import FileUploader from '../file-uploader-container/file-uploader.jsx';

const Selfie = ({ getSocketFunc, root_class, onFileDrop }) => {
    const ref = React.useRef();
    return (
        <React.Fragment>
            <Icon icon='IcSelfie' size={236} />
            <Text as='p' size='s' weight='bold' color='prominent'>
                {localize('Upload your selfie')}
            </Text>
            <Text as='p' size='xs'>
                {localize(
                    'Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your face is within the frame.'
                )}
            </Text>
            <FileUploaderContainer>
                <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} />
            </FileUploaderContainer>
            <DetailGrid root_class={root_class} />
        </React.Fragment>
    );
};

Selfie.propTypes = {
    onFileDrop: PropTypes.func.isRequired,
    root_class: PropTypes.string.isRequired,
    getSocketFunc: PropTypes.func.isRequired,
};

export default Selfie;

import React from 'react';
import { Text } from '@deriv/components';
import { isMobile, WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import FileUploader from './file-uploader';
import { TFile } from '../../Types/common-prop.type';

type TFileUploaderContainer = {
    getSocket?: () => WebSocket;
    onFileDrop: (file: TFile | undefined) => void;
    onRef: (ref: React.RefObject<unknown> | undefined) => void;
    files_description: React.ReactNode;
    examples: React.ReactNode;
};

const FileUploaderContainer = ({
    examples,
    files_description,
    getSocket,
    onFileDrop,
    onRef,
}: TFileUploaderContainer) => {
    const ref = React.useRef(null);

    const getSocketFunc = getSocket ?? WS.getSocket;

    React.useEffect(() => {
        if (ref) {
            if (typeof onRef === 'function') onRef(ref);
        }
        return () => onRef(undefined);
    }, [onRef, ref]);

    return (
        <div className='file-uploader__container' data-testid='dt_file_uploader_container'>
            {files_description && files_description}
            <Text size={isMobile() ? 'xxs' : 'xs'} as='div' className='file-uploader__file-title' weight='bold'>
                {localize('Upload file')}
            </Text>
            <div className='file-uploader__file'>
                <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} />
            </div>
            <div className='file-uploader__file-supported-formats'>
                <Text size={isMobile() ? 'xxxs' : 'xxs'} className=''>
                    {localize('Supported formats: JPEG, JPG, PNG and PDF only')}
                </Text>
                <Text size={isMobile() ? 'xxxs' : 'xxs'}>{localize('Maximum size: 8MB')}</Text>
            </div>
            {examples && examples}
        </div>
    );
};

export default FileUploaderContainer;

import React from 'react';
import { Text } from '@deriv/components';
import { isMobile, WS } from '@deriv/shared';
// import type { TSettings } from '@deriv/shared/src/utils/files/file-uploader-utils';
import { Localize } from '@deriv/translations';
import FileUploader from './file-uploader';
import { TFile } from '../../Types';
import { useFileUploader } from '@deriv/hooks';

type TSettings = Partial<Parameters<ReturnType<typeof useFileUploader>['uploader']>[1]>;

type TFileUploaderContainer = {
    getSocket?: () => WebSocket;
    onFileDrop: (file: TFile | undefined) => void;
    onRef: (ref: React.RefObject<null | { upload: () => void }> | undefined) => void;
    settings?: Partial<TSettings>;
    files_description: React.ReactNode;
    examples: React.ReactNode;
};

const FileUploaderContainer = ({
    examples,
    files_description,
    getSocket,
    onFileDrop,
    onRef,
    settings,
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
            {files_description}
            <Text size={isMobile() ? 'xxs' : 'xs'} as='div' className='file-uploader__file-title' weight='bold'>
                <Localize i18n_default_text='Upload file' />
            </Text>
            <div className='file-uploader__file-dropzone-wrapper'>
                <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} settings={settings} />
            </div>
            <div className='file-uploader__file-supported-formats'>
                <Text size={isMobile() ? 'xxxs' : 'xxs'}>
                    <Localize i18n_default_text='Supported formats: JPEG, JPG, PNG, PDF and GIF only' />
                </Text>
                <Text size={isMobile() ? 'xxxs' : 'xxs'}>
                    <Localize i18n_default_text='Maximum size: 8MB' />
                </Text>
            </div>
            {examples}
        </div>
    );
};

export default FileUploaderContainer;

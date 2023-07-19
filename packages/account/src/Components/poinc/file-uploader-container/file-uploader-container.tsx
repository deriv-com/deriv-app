import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { isDesktop, WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import FileUploader from 'Components/file-uploader';
import { TDocumentSettings, TFileUploaderContainer } from 'Types';

export type TPoincFileUploaderContainer = {
    document_type: TDocumentSettings['documentType'] | '';
} & TFileUploaderContainer;

const PoincFileUploaderContainer = ({
    document_type,
    is_description_enabled = true,
    getSocket,
    onFileDrop,
    onRef,
}: TPoincFileUploaderContainer) => {
    const ref = React.useRef(null);
    const getSocketFunc = getSocket ?? WS.getSocket;

    React.useEffect(() => {
        if (ref && typeof onRef === 'function') onRef(ref);
        return () => onRef(undefined);
    }, [onRef, ref]);

    const properties = [
        { name: 'size', icon: 'IcLessThanEight', text: localize('Less than 8MB') },
        { name: 'format', icon: 'IcImage', text: localize('JPEG JPG PNG PDF') },
        { name: 'with-address', icon: 'IcUser', text: localize('Issued under your name with your current address') },
        { name: 'time', icon: 'IcClock', text: localize('1 - 6 months old') },
    ];

    return (
        <div className='account__file-uploader-section'>
            {is_description_enabled && (
                <ul className='account__file-uploader-list'>
                    {properties.map(({ name, icon, text }) => (
                        <li key={name} className='account__file-uploader-box'>
                            <Icon icon={icon} className='account__file-uploader-icon' size={24} />
                            <div className='account__file-uploader-item'>
                                <Text size='xxs' align='center'>
                                    {text}
                                </Text>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div
                className={classNames('account__file-uploader-file', {
                    'account__file-uploader-file--dashboard': isDesktop(),
                })}
                data-testid='dt_file_uploader_container'
            >
                <FileUploader
                    getSocket={getSocketFunc}
                    ref={ref}
                    onFileDrop={onFileDrop}
                    settings={{ documentType: document_type }}
                />
            </div>
        </div>
    );
};

export default PoincFileUploaderContainer;

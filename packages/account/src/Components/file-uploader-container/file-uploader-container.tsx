import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { PlatformContext, isDesktop, WS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import FileUploader from './file-uploader';
import { TFile, TPlatformContext } from 'Types';

export type TFileUploaderContainer = {
    is_description_enabled?: boolean;
    getSocket: () => WebSocket;
    onFileDrop: (file: TFile | undefined) => void;
    onRef: (ref: React.RefObject<unknown> | undefined) => void;
};

const FileProperties = () => {
    const properties = [
        { name: 'size', icon: 'IcPoaFileEightMb', text: localize('Less than 8MB') },
        { name: 'format', icon: 'IcPoaFileFormat', text: localize('JPEG  JPG  PNG  PDF  GIF') },
        { name: 'time', icon: 'IcPoaFileTime', text: localize('1 - 6 months old') },
        { name: 'clear', icon: 'IcPoaFileClear', text: localize('A clear colour photo or scanned image') },
        {
            name: 'with-address',
            icon: 'IcPoaFileWithAddress',
            text: localize('Issued under your name with your current address'),
        },
    ];
    return (
        <div className='account-poa__upload-property'>
            {properties.map(item => (
                <div
                    className={`account-poa__upload-property-item account-poa__upload-property-${item.name}`}
                    key={item.name}
                >
                    <div className='account-poa__upload-property-wrapper'>
                        <Icon icon={item.icon} className='account-poa__upload-icon-dashboard' size={40} />
                        <Text size='xxxs' weight='bold' align='center'>
                            {item.text}
                        </Text>
                    </div>
                </div>
            ))}
        </div>
    );
};

const FileUploaderContainer = ({
    is_description_enabled = true,
    getSocket,
    onFileDrop,
    onRef,
}: TFileUploaderContainer) => {
    const { is_appstore } = React.useContext<Partial<TPlatformContext>>(PlatformContext);
    const ref = React.useRef();

    const getSocketFunc = getSocket ?? WS.getSocket;

    React.useEffect(() => {
        if (ref) {
            if (typeof onRef === 'function') onRef(ref);
        }
        return () => onRef(undefined);
    }, [onRef, ref]);
    if (is_appstore && isDesktop()) {
        return (
            <div className='account-poa__upload-section account-poa__upload-section-dashboard'>
                <div className='account-poa__upload-file account-poa__upload-file-dashboard'>
                    <FileProperties />
                    <div className='account-poa__upload-file-zone'>
                        <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='account-poa__upload-section' data-testid='dt_file_uploader_container'>
            {is_description_enabled && (
                <ul className='account-poa__upload-list'>
                    <li className='account-poa__upload-box'>
                        {is_appstore ? (
                            <Icon icon='IcPoaFileEightMb' className='account-poa__upload-icon' size={24} />
                        ) : (
                            <Icon icon='IcLessThanEight' className='account-poa__upload-icon' size={24} />
                        )}
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='Less than 8MB' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        <Icon icon='IcImage' className='account-poa__upload-icon' size={24} />
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='JPEG JPG PNG PDF GIF' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        {is_appstore ? (
                            <Icon icon='IcPoaFileTime' className='account-poa__upload-icon' size={24} />
                        ) : (
                            <Icon icon='IcClock' className='account-poa__upload-icon' size={24} />
                        )}
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='1 - 6 months old' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        {is_appstore ? (
                            <Icon icon='IcPoaFileClear' className='account-poa__upload-icon' size={24} />
                        ) : (
                            <Icon icon='IcEye' className='account-poa__upload-icon' size={24} />
                        )}
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='A clear colour photo or scanned image' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        {is_appstore ? (
                            <Icon icon='IcPoaFileWithAddress' className='account-poa__upload-icon' size={24} />
                        ) : (
                            <Icon icon='IcUser' className='account-poa__upload-icon' size={24} />
                        )}
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='Issued under your name with your current address' />
                        </div>
                    </li>
                </ul>
            )}
            <div
                className={classNames('account-poa__upload-file', {
                    'account-poa__upload-file--dashboard': isDesktop() && is_appstore,
                })}
            >
                <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} />
            </div>
        </div>
    );
};

export default FileUploaderContainer;

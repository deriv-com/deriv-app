import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { PlatformContext, isDesktop } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import FileUploader from './file-uploader.jsx';

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

const FileUploaderContainer = ({ is_description_enabled = true, getSocket, onFileDrop, onRef }) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    const ref = React.useRef();

    const getSocketFunc = getSocket ?? WS.getSocket;

    React.useEffect(() => {
        if (ref) {
            if (typeof onRef === 'function') onRef(ref);
        }
        return () => onRef(undefined);
    }, [onRef, ref]);
    if (is_dashboard && isDesktop()) {
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
        <div className='account-poa__upload-section'>
            {is_description_enabled && (
                <ul className='account-poa__upload-list'>
                    {!is_dashboard && (
                        <li className='account-poa__upload-box'>
                            <Icon icon='IcUtility' className='account-poa__upload-icon' size={20} />
                            <div className='account-poa__upload-item'>
                                <Localize i18n_default_text='A recent utility bill (e.g. electricity, water, gas, phone or internet)' />
                            </div>
                        </li>
                    )}
                    <li className='account-poa__upload-box'>
                        {is_dashboard ? (
                            <Icon icon='IcBankDashboard' className='account-poa__upload-icon' size={24} />
                        ) : (
                            <Icon icon='IcBank' className='account-poa__upload-icon' size={20} />
                        )}
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='A recent bank statement or government-issued letter with your name and address' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        {is_dashboard ? (
                            <Icon icon='IcPoaFileWithAddress' className='account-poa__upload-icon' size={24} />
                        ) : (
                            <Icon icon='IcUser' className='account-poa__upload-icon' size={20} />
                        )}
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='Issued under your name with your current address' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        {is_dashboard ? (
                            <Icon icon='IcPoaFileEightMb' className='account-poa__upload-icon' size={24} />
                        ) : (
                            <Icon icon='IcLessThanEight' className='account-poa__upload-icon' size={20} />
                        )}
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='Less than 8MB' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        {is_dashboard ? (
                            <Icon icon='IcPoaFileTime' className='account-poa__upload-icon' size={24} />
                        ) : (
                            <Icon icon='IcClock' className='account-poa__upload-icon' size={20} />
                        )}
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='1 - 6 months old' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        {is_dashboard ? (
                            <Icon icon='IcPoaFileClear' className='account-poa__upload-icon' size={24} />
                        ) : (
                            <Icon icon='IcEye' className='account-poa__upload-icon' size={20} />
                        )}
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='A clear colour photo or scanned image' />
                        </div>
                    </li>
                </ul>
            )}
            <div
                className={classNames('account-poa__upload-file', {
                    'account-poa__upload-file--dashboard': isDesktop() && is_dashboard,
                })}
            >
                <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} />
            </div>
        </div>
    );
};

FileUploaderContainer.propTypes = {
    is_description_enabled: PropTypes.bool,
    getSocket: PropTypes.func,
    onFileDrop: PropTypes.func,
    onRef: PropTypes.func,
};

export default FileUploaderContainer;

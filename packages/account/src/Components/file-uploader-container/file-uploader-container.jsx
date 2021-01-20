import React from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import FileUploader from './file-uploader.jsx';

const FileUploaderContainer = ({ is_description_disabled, getSocket, onFileDrop, onRef }) => {
    const ref = React.useRef();

    const getSocketFunc = getSocket ?? WS.getSocket;

    React.useEffect(() => {
        if (ref) {
            if (typeof onRef === 'function') onRef(ref);
        }
        return () => onRef(undefined);
    }, [onRef, ref]);
    return (
        <div className='account-poa__upload-section'>
            {!is_description_disabled && (
                <ul className='account-poa__upload-list'>
                    <li className='account-poa__upload-box'>
                        <Icon icon='IcUtility' className='account-poa__upload-icon' size={20} />
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='A recent utility bill (e.g. electricity, water, gas, phone or internet)' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        <Icon icon='IcBank' className='account-poa__upload-icon' size={20} />
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='A recent bank statement or government-issued letter with your name and address' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        <Icon icon='IcUser' className='account-poa__upload-icon' size={20} />
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='Issued under your name with your current address' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        <Icon icon='IcLessThanEight' className='account-poa__upload-icon' size={20} />
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='Less than 8MB' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        <Icon icon='IcClock' className='account-poa__upload-icon' size={20} />
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='1 - 6 months old' />
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        <Icon icon='IcEye' className='account-poa__upload-icon' size={20} />
                        <div className='account-poa__upload-item'>
                            <Localize i18n_default_text='A clear colour photo or scanned image' />
                        </div>
                    </li>
                </ul>
            )}
            <div className='account-poa__upload-file'>
                <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} />
            </div>
        </div>
    );
};

FileUploaderContainer.defaultProps = {
    is_description_disabled: false,
};

export default FileUploaderContainer;

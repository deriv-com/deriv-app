import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@deriv/components';
import { isDesktop, WS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import FileUploader from '../file-uploader';

const PoincFileUploaderContainer = ({ is_description_enabled = true, getSocket, onFileDrop, onRef }) => {
    const ref = React.useRef();

    const getSocketFunc = getSocket ?? WS.getSocket;

    React.useEffect(() => {
        if (ref) {
            if (typeof onRef === 'function') onRef(ref);
        }
        return () => onRef(undefined);
    }, [onRef, ref]);

    return (
        <div className='account__file-uploader-section'>
            {is_description_enabled && (
                <ul className='account__file-uploader-list'>
                    <li className='account__file-uploader-box'>
                        <Icon icon='IcLessThanEight' className='account__file-uploader-icon' size={24} />
                        <div className='account__file-uploader-item'>
                            <Localize i18n_default_text='Less than 8MB' />
                        </div>
                    </li>
                    <li className='account__file-uploader-box'>
                        <Icon icon='IcImage' className='account__file-uploader-icon' size={24} />
                        <div className='account__file-uploader-item'>
                            <Localize i18n_default_text='JPEG JPG PNG PDF' />
                        </div>
                    </li>
                    <li className='account__file-uploader-box'>
                        <Icon icon='IcUser' className='account__file-uploader-icon' size={24} />
                        <div className='account__file-uploader-item'>
                            <Localize i18n_default_text='Issued under your name with your current address' />
                        </div>
                    </li>
                    <li className='account__file-uploader-box'>
                        <Icon icon='IcClock' className='account__file-uploader-icon' size={24} />
                        <div className='account__file-uploader-item'>
                            <Localize i18n_default_text='1 - 6 months old' />
                        </div>
                    </li>
                </ul>
            )}
            <div
                className={classNames('account__file-uploader-file', {
                    'account__file-uploader-file--dashboard': isDesktop(),
                })}
            >
                <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} />
            </div>
        </div>
    );
};

PoincFileUploaderContainer.propTypes = {
    is_description_enabled: PropTypes.bool,
    getSocket: PropTypes.func,
    onFileDrop: PropTypes.func,
    onRef: PropTypes.func,
};

export default PoincFileUploaderContainer;

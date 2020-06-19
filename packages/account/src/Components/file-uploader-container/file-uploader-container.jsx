import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import FileUploader from './file-uploader.jsx';

class FileUploaderContainer extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.getSocketFunc = props.getSocket ?? WS.getSocket;
    }

    componentDidMount() {
        this.props.onRef(this.ref);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    render() {
        return (
            <div className='account-poa__upload-section'>
                {!this.props.is_description_disabled && (
                    <ul className='account-poa__upload-list'>
                        <li className='account-poa__upload-box'>
                            <Icon icon='IcUtility' className='account-poa__upload-icon' size={20} />
                            <div className='account-poa__upload-item'>
                                {localize('A recent utility bill (e.g. electricity, water, gas, phone or internet)')}
                            </div>
                        </li>
                        <li className='account-poa__upload-box'>
                            <Icon icon='IcBank' className='account-poa__upload-icon' size={20} />
                            <div className='account-poa__upload-item'>
                                {localize(
                                    'A recent bank statement or government-issued letter with your name and address'
                                )}
                            </div>
                        </li>
                        <li className='account-poa__upload-box'>
                            <Icon icon='IcUser' className='account-poa__upload-icon' size={20} />
                            <div className='account-poa__upload-item'>
                                {localize('Issued under your name with your current address')}
                            </div>
                        </li>
                        <li className='account-poa__upload-box'>
                            <Icon icon='IcLessThanEight' className='account-poa__upload-icon' size={20} />
                            <div className='account-poa__upload-item'>{localize('Less than 8MB')}</div>
                        </li>
                        <li className='account-poa__upload-box'>
                            <Icon icon='IcClock' className='account-poa__upload-icon' size={20} />
                            <div className='account-poa__upload-item'>{localize('1 - 6 months old')}</div>
                        </li>
                        <li className='account-poa__upload-box'>
                            <Icon icon='IcEye' className='account-poa__upload-icon' size={20} />
                            <div className='account-poa__upload-item'>
                                {localize('A clear colour photo or scanned image')}
                            </div>
                        </li>
                    </ul>
                )}
                <div className='account-poa__upload-file'>
                    <FileUploader getSocket={this.getSocketFunc} ref={this.ref} onFileDrop={this.props.onFileDrop} />
                </div>
            </div>
        );
    }
}

FileUploaderContainer.defaultProps = {
    is_description_disabled: false,
};

export default FileUploaderContainer;

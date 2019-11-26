import React              from 'react';
import { localize }       from 'deriv-translations';
import IconClearPhoto     from 'Assets/AccountManagement/ProofOfAddress/icon-clear-photo.svg';
import IconIssuedUnder    from 'Assets/AccountManagement/ProofOfAddress/icon-issued-under.svg';
import IconLessThanEight  from 'Assets/AccountManagement/ProofOfAddress/icon-less-than-8.svg';
import IconOneToSixMonths from 'Assets/AccountManagement/ProofOfAddress/icon-one-to-six-months.svg';
import IconRecentBank     from 'Assets/AccountManagement/ProofOfAddress/icon-recent-bank.svg';
import IconRecentUtility  from 'Assets/AccountManagement/ProofOfAddress/icon-recent-utility.svg';
import FileUploader       from './file-uploader.jsx';

class FileUploaderContainer extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
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
                <ul className='account-poa__upload-list'>
                    <li className='account-poa__upload-box'>
                        <IconRecentUtility className='account-poa__upload-icon' />
                        <div className='account-poa__upload-item'>
                            {localize('A recent utility bill (e.g. electricity, water, gas, phone or internet)')}
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        <IconRecentBank className='account-poa__upload-icon' />
                        <div className='account-poa__upload-item'>
                            {localize('A recent bank statement or government-issued letter with your name and address')}
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        <IconIssuedUnder className='account-poa__upload-icon' />
                        <div className='account-poa__upload-item'>
                            {localize('Issued under your name with your current address')}
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        <IconLessThanEight className='account-poa__upload-icon' />
                        <div className='account-poa__upload-item'>
                            {localize('Less than 8MB')}
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        <IconOneToSixMonths className='account-poa__upload-icon' />
                        <div className='account-poa__upload-item'>
                            {localize('1 - 6 months old')}
                        </div>
                    </li>
                    <li className='account-poa__upload-box'>
                        <IconClearPhoto className='account-poa__upload-icon' />
                        <div className='account-poa__upload-item'>
                            {localize('A clear colour photo or scanned image')}
                        </div>
                    </li>
                </ul>
                <div className='account-poa__upload-file'>
                    <FileUploader
                        ref={this.ref}
                        onFileDrop={this.props.onFileDrop}
                    />
                </div>
            </div>
        );
    }
}

export default FileUploaderContainer;

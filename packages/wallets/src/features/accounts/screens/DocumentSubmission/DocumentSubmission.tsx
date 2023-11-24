import React from 'react';
import { Dropzone, useFlow, WalletText } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';
import Upload from '../../../../public/images/accounts/upload.svg';
import { getExampleImagesConfig } from '../../constants';
import { CommonMistakesExamples } from '../CommonMistakesExamples';
import './DocumentSubmission.scss';

const listItems = [
    'Utility bill: electricity, water, gas, or landline phone bill.',
    'Financial, legal, or government document: recent bank statement, affidavit, or government-issued letter.',
    'Home rental agreement: valid and current agreement.',
];

const DocumentSubmission: React.FC = () => {
    const { isMobile } = useDevice();
    const { setFormValues } = useFlow();

    return (
        <div className='wallets-poa__document'>
            <div className='wallets-poa__document__title'>
                <WalletText weight='bold'>Document Submission</WalletText>
                <div className='wallets-poa__document__title__divider' />
            </div>
            <div className='wallets-poa__document__container'>
                <div className='wallets-poa__document__container__disclaimer'>
                    <WalletText size='sm' weight='bold'>
                        We accept only these types of documents as proof of address. The document must be recent (issued
                        within last 6 months) and include your name and address:
                    </WalletText>

                    <ul className='wallets-poa__document__container__disclaimer__list'>
                        {listItems.map(item => (
                            <li key={`list-item-${item}`}>
                                <WalletText size='sm'>{item}</WalletText>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='wallets-poa__document__container__upload'>
                    <WalletText size='sm' weight='bold'>
                        Upload File
                    </WalletText>
                    <Dropzone
                        description='Remember, selfies, pictures of houses, or non-related images will be rejected.'
                        descriptionColor='primary'
                        descriptionSize='sm'
                        fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                        hoverMessage='Upload your file here'
                        icon={<Upload />}
                        maxSize={8388608}
                        onFileChange={(file: File) => setFormValues('documentFile', file)}
                        title='Drag and drop a file or click to browse your files.'
                        titleType='bold'
                    />
                    <div className='wallets-poa__document__container__upload__requirements'>
                        <WalletText size={isMobile ? 'xs' : 'sm'}>
                            Supported formats : JPEG, JPG, PNG, PDF, and GIF only
                        </WalletText>
                        <WalletText size={isMobile ? 'xs' : 'sm'}>Maximum size : 8MB</WalletText>
                    </div>
                </div>
                <div className='wallets-poa__document__container__common-mistakes'>
                    <WalletText size='sm' weight='bold'>
                        Common Mistakes
                    </WalletText>

                    <div className='wallets-common-mistakes__content'>
                        {getExampleImagesConfig().map(config => (
                            <CommonMistakesExamples
                                description={config.description}
                                image={<config.image />}
                                key={`common-mistake-${config.description}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentSubmission;

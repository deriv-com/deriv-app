import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useIsEuRegion } from '@deriv/api-v2';
import { LabelPairedArrowUpFromBracketXlFillIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { Dropzone } from '../../../../../../components';
import { TDocumentSubmission } from '../../types';
import { getExampleImagesConfig } from '../../utils';
import { CommonMistakesExamples } from '../CommonMistakesExamples';
import './DocumentSubmission.scss';

const DocumentSubmission: React.FC = () => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const { data: isEuRegion } = useIsEuRegion();
    const { setFieldValue, values } = useFormikContext<TDocumentSubmission>();

    const listItems = [
        localize('Utility bill: electricity, water, gas, or landline phone bill.'),
        localize(
            'Financial, legal, or government document: recent bank statement, affidavit, or government-issued letter.'
        ),
        localize('Home rental agreement: valid and current agreement.'),
    ];

    useEffect(() => {
        return () => {
            setFieldValue('poaFile', null);
        };
    }, [setFieldValue]);

    return (
        <div className='wallets-poa__document'>
            <div className='wallets-poa__document__title'>
                <Text weight='bold'>
                    <Localize i18n_default_text='Document submission' />
                </Text>
                <div className='wallets-poa__document__title__divider' />
            </div>
            <div className='wallets-poa__document__container'>
                <div className='wallets-poa__document__container__disclaimer'>
                    <Text align='start' size='sm' weight='bold'>
                        {localize(
                            'We accept only these types of documents as proof of address. The document must be recent (issued within last {{timePeriod}} months) and include your name and address:',
                            { timePeriod: isEuRegion ? '6' : '12' }
                        )}
                    </Text>

                    <ul className='wallets-poa__document__container__disclaimer-list'>
                        {listItems.map(item => (
                            <li key={`list-item-${item}`}>
                                <Text size='sm'>{item}</Text>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='wallets-poa__document__container__common-mistakes'>
                    <Text size='sm' weight='bold'>
                        <Localize i18n_default_text='Common mistakes' />
                    </Text>

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
                <div className='wallets-poa__document__container__upload'>
                    <Text size='sm' weight='bold'>
                        <Localize i18n_default_text='Upload file' />
                    </Text>
                    <Dropzone
                        defaultFile={values.poaFile}
                        description={localize(
                            'Remember, selfies, pictures of houses, or non-related images will be rejected.'
                        )}
                        descriptionColor='primary'
                        descriptionSize='sm'
                        fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                        hoverMessage={localize('Upload your file here')}
                        icon={<LabelPairedArrowUpFromBracketXlFillIcon fill='#C7E5E5' height='32' width='30' />}
                        maxSize={8388608}
                        onFileChange={(file?: File) => setFieldValue('poaFile', file)}
                        title={localize('Drag and drop a file or click to browse your files.')}
                        titleType='bold'
                    />
                    <div className='wallets-poa__document__container__upload__requirements'>
                        <Text size={!isDesktop ? 'xs' : 'sm'}>
                            <Localize i18n_default_text='Supported formats : JPEG, JPG, PNG, PDF, and GIF only' />
                        </Text>
                        <Text size={!isDesktop ? 'xs' : 'sm'}>
                            <Localize i18n_default_text='Maximum size : 8MB' />
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentSubmission;

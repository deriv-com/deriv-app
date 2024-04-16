import React from 'react';
import * as Yup from 'yup';
import { StandaloneArrowUpFromBracketBoldIcon } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';
import { FormDocumentUploadField } from '../../../components/FormFields';
import { CommonMistakesExamples, getExampleImagesConfig } from '../CommonMistakeExample';

const listItems = [
    'Utility bill: electricity, water, gas, or landline phone bill.',
    'Financial, legal, or government document: recent bank statement, affidavit, or government-issued letter.',
    'Home rental agreement: valid and current agreement.',
];

const documentValidation = Yup.mixed().required('Please upload a file');

export const DocumentSubmission: React.FC = () => {
    const { isMobile } = useDevice();

    return (
        <div className='flex flex-col items-start w-full gap-24 lg:w-auto'>
            <div className='flex h-24 gap-8 self-stretch lg:self-auto justify-center items-center lg:gap-[11px]'>
                <Text weight='bold'>Document Submission</Text>
                <div className='w-full h-1 flex-[1_1_0] bg-solid-grey-2 lg:flex-shrink-0' />
            </div>
            <div className='self-stretch p-0 px-24 py-16 space-y-16 border-none lg:border-solid lg:border-1 border-solid-grey-5 rounded-8'>
                <div className='flex flex-col items-start self-stretch gap-16'>
                    <Text size='sm' weight='bold'>
                        We accept only these types of documents as proof of address. The document must be recent (issued
                        within last 6 months) and include your name and address:
                    </Text>
                    <ul className='pl-20 list-disc'>
                        {listItems.map(item => (
                            <li key={`list-item-${item}`}>
                                <Text size='sm'>{item}</Text>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='w-full space-y-16'>
                    <Text size='sm' weight='bold'>
                        Common Mistakes
                    </Text>
                    <div className='grid items-center justify-center grid-cols-1 lg:grid-cols-3 lg:gap-44 lg:gap-y-16'>
                        {getExampleImagesConfig().map(config => (
                            <CommonMistakesExamples
                                description={config.description}
                                image={config.image}
                                key={`common-mistake-${config.description}`}
                            />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col items-start self-stretch gap-16'>
                    <Text size='sm' weight='bold'>
                        Upload File
                    </Text>
                    <FormDocumentUploadField
                        className='w-full'
                        description='Remember, selfies, pictures of houses, or non-related images will be rejected.'
                        descriptionColor='primary'
                        descriptionSize='2xs'
                        fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                        hoverMessage='Upload your file here'
                        icon={<StandaloneArrowUpFromBracketBoldIcon className='fill-solid-green-2' iconSize='lg' />}
                        maxSize={8388608}
                        name='document'
                        title='Drag and drop a file or click to browse your files.'
                        titleType='bold'
                        validationSchema={documentValidation}
                    />
                    <div className='flex items-start self-stretch justify-between'>
                        <Text size={isMobile ? '2xs' : 'xs'}>
                            Supported formats : JPEG, JPG, PNG, PDF, and GIF only
                        </Text>
                        <Text size={isMobile ? '2xs' : 'xs'}>Maximum size : 8MB</Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

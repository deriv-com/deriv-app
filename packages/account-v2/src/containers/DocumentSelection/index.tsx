import React from 'react';
import { useBreakpoint } from '@deriv/quill-design';
import { StandaloneChevronRightRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { Card } from '../../components/Card';
import { getManualUploadDocumentList } from '../../constants/manual-document';

type TDocumentSelection = {
    countryCode: string;
    handleOnClick: (value: string) => void;
};

const DocumentSelection = ({ countryCode, handleOnClick }: TDocumentSelection) => {
    const { isMobile } = useBreakpoint();

    const documentList = getManualUploadDocumentList(countryCode);

    return (
        <div className='flex flex-col'>
            <Text as='h2' className='manual-poi__title' color='prominent' size='xs'>
                Please upload one of the following documents:
            </Text>
            <div className='gap-900'>
                {documentList.map(document => (
                    <Card
                        className='flex flex-row items-center cursor-pointer'
                        key={document.value}
                        onClick={() => handleOnClick(document.value)}
                    >
                        <document.icon />
                        <div className='flex flex-col flex-grow ml-1200 gap-400'>
                            <Text as='p' color='prominent' size={isMobile ? 'xs' : 'sm'} weight='bold'>
                                {document.title}
                            </Text>
                            <Text as='p' size={isMobile ? '2xs' : 'xs'}>
                                {document.description}
                            </Text>
                        </div>
                        <StandaloneChevronRightRegularIcon />
                    </Card>
                ))}
            </div>
            <div />
        </div>
    );
};

export default DocumentSelection;

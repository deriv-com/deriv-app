import React, { Fragment } from 'react';
import { useBreakpoint } from '@deriv/quill-design';
import { StandaloneChevronRightRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { Card } from '../../components/Card';
import { getManualUploadDocumentList } from '../../constants/manual-document';

type TDocumentSelection = {
    countryCode: string;
    handleOnClick: (value: string) => void;
};

export const DocumentSelection = ({ countryCode, handleOnClick }: TDocumentSelection) => {
    const { isMobile } = useBreakpoint();

    const documentList = getManualUploadDocumentList(countryCode === 'ng');

    return (
        <div className='flex flex-col'>
            <Text as='h2' color='prominent' size='xs'>
                Please upload one of the following documents:
            </Text>
            {documentList.map(({ description, icon: Icon, title, value }) => (
                <Card
                    className='flex flex-row items-center cursor-pointer'
                    key={value}
                    onClick={() => handleOnClick(value)}
                >
                    <Icon />
                    <div className='flex flex-col flex-grow ml-1200 gap-400'>
                        <Text as='p' color='prominent' size={isMobile ? 'xs' : 'sm'} weight='bold'>
                            {title}
                        </Text>
                        <Text as='p' size={isMobile ? '2xs' : 'xs'}>
                            {description}
                        </Text>
                    </div>
                    <StandaloneChevronRightRegularIcon />
                </Card>
            ))}
            <div />
        </div>
    );
};

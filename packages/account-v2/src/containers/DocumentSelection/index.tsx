import React from 'react';
import { Text } from '@deriv-com/ui';

type TDocumentSelection = {
    countryCode: string;
};

const DocumentSelection = ({ countryCode }: TDocumentSelection) => {
    return (
        <div>
            <Text as='h2' className='manual-poi__title' color='prominent' size='xs'>
                Please upload one of the following documents:
            </Text>
            <div />
        </div>
    );
};

export default DocumentSelection;

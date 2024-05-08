import React, { Fragment, useState } from 'react';
import { Text } from '@deriv-com/ui';
import { MaskCardModal } from '../MaskCardModal/MaskCardModal';

export const ExampleLink = () => {
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    return (
        <Fragment>
            <Text as='span' className='cursor-pointer' color='red' onClick={() => setIsSampleModalOpen(true)} size='sm'>
                See example
            </Text>
            <MaskCardModal isOpen={isSampleModalOpen} onClose={() => setIsSampleModalOpen(false)} />
        </Fragment>
    );
};

import React, { ReactElement, ReactNode } from 'react';
import { Text } from '@deriv/quill-design';
import StatusLoss from '../../../../public/images/status-loss.svg';

type TCommonMistakeExamplePartialsProps = {
    description: ReactNode;
    image: ReactElement;
};

const CommonMistakesExamples = ({ description, image }: TCommonMistakeExamplePartialsProps) => (
    <div className='bg-[#ff444f14] gap-800 flex flex-col items-center p-400 box-border border-system-light-secondary-background border-sm rounded-200 w-[237px] h-[218px] ms-auto'>
        {image}
        <div className='grid grid-cols-1 gap-400'>
            <StatusLoss />
            <Text size='xs'>{description}</Text>
        </div>
    </div>
);

export default CommonMistakesExamples;

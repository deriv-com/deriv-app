import React from 'react';
import { StandaloneCircleXmarkRegularIcon as CrossIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';

type TCommonMistakeExamplePartialsProps = {
    description: React.ReactNode;
    image: React.ReactElement;
};

export const CommonMistakesExamples = ({ description, image }: TCommonMistakeExamplePartialsProps) => (
    <div className='flex flex-col bg-solid-coral-14/[0.16] items-center space-y-16 p-8 box-border border-solid border-1 border-solid-grey-2 rounded-4 w-[237px] h-[218px]'>
        {image}
        <div className='grid grid-cols-[1fr_auto] items-center gap-x-4'>
            <CrossIcon fill='red' iconSize='sm' />
            <Text size='2xs'>{description}</Text>
        </div>
    </div>
);

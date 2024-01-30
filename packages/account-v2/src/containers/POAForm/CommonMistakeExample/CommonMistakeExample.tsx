import React from 'react';
import { StandaloneCircleXmarkRegularIcon as CrossIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui/dist/components/Text';

type TCommonMistakeExamplePartialsProps = {
    description: React.ReactNode;
    image: React.ReactElement;
};

const CommonMistakesExamples = ({ description, image }: TCommonMistakeExamplePartialsProps) => (
    <div className='flex flex-col bg-solid-coral-700/[0.16] items-center space-y-800 p-400 box-border border-solid border-75 border-solid-grey-2 rounded-200 w-[237px] h-[218px]'>
        {image}
        <div className='grid grid-cols-[1fr_auto] items-center gap-x-200'>
            <CrossIcon fill='red' iconSize='sm' />
            <Text size='2xs'>{description}</Text>
        </div>
    </div>
);

export default CommonMistakesExamples;

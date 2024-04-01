import React, { useState } from 'react';
import { AdConditionsModal } from '@/components/Modals';
import { AD_CONDITION_CONTENT, AD_CONDITION_TYPES } from '@/constants';
import { LabelPairedCircleInfoCaptionRegularIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';

type TAdConditionContentHeaderProps = {
    type: typeof AD_CONDITION_TYPES[keyof typeof AD_CONDITION_TYPES];
};

const AdConditionContentHeader = ({ type }: TAdConditionContentHeaderProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isMobile } = useDevice();
    return (
        <div className='flex gap-[0.8rem] items-center'>
            <Text color='less-prominent' size={isMobile ? 'md' : 'sm'}>
                {AD_CONDITION_CONTENT[type]?.title}
            </Text>
            <Button className='p-0 hover:bg-none' color='white' onClick={() => setIsModalOpen(true)} variant='outlined'>
                <LabelPairedCircleInfoCaptionRegularIcon
                    data-testid='dt_p2p_v2_ad_condition_tooltip_icon'
                    fill='#999999'
                    height={24}
                    width={24}
                />
            </Button>
            {isModalOpen && (
                <AdConditionsModal isModalOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} type={type} />
            )}
        </div>
    );
};

export default AdConditionContentHeader;

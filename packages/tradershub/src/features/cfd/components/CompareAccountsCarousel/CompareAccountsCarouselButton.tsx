import React from 'react';
import { IconButton, qtMerge } from '@deriv/quill-design';
import { LabelPairedChevronLeftMdRegularIcon, LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';

type TPrevNextButtonProps = {
    enabled: boolean;
    isNext?: boolean;
    onClick: () => void;
};

const CFDCompareAccountsCarouselButton = ({ enabled, isNext = false, onClick }: TPrevNextButtonProps) => (
    <IconButton
        className={qtMerge(
            'bg-system-light-primary-background z-10 absolute lg:flex items-center justify-center top-1/2 cursor-pointer w-40 h-40 rounded-[50%] border-solid-coral-100 border-solid border-1 disabled:opacity-8 disabled:hidden',
            isNext && 'right-16',
            !isNext && 'left-16'
        )}
        colorStyle='text-primary'
        componentType='icon-only'
        disabled={!enabled}
        icon={isNext ? LabelPairedChevronRightMdRegularIcon : LabelPairedChevronLeftMdRegularIcon}
        isRound
        onClick={onClick}
        size='md'
    />
);
export default CFDCompareAccountsCarouselButton;

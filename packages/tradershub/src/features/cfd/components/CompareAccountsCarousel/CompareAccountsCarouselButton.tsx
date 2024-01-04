import React from 'react';
import { IconButton, qtMerge } from '@deriv/quill-design';
import { LabelPairedChevronLeftMdRegularIcon, LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';

type TPrevNextButtonProps = {
    enabled: boolean;
    isNext: boolean;
    onClick: () => void;
};

const CFDCompareAccountsCarouselButton = ({ enabled, isNext, onClick }: TPrevNextButtonProps) => (
    <IconButton
        className={qtMerge(
            'bg-system-light-primary-background z-[1] absolute hidden lg:flex items-center justify-center top-1/2 cursor-pointer w-2000 h-2000 rounded-[50%] border-solid border-75 disbaled:opacity-400 disabled:hidden',
            isNext && 'right-800',
            !isNext && 'left-800'
        )}
        colortyle='text-primary'
        componentType='icon-only'
        disabled={!enabled}
        icon={isNext ? LabelPairedChevronRightMdRegularIcon : LabelPairedChevronLeftMdRegularIcon}
        isRound
        onClick={onClick}
        size='md'
    />
);
export default CFDCompareAccountsCarouselButton;

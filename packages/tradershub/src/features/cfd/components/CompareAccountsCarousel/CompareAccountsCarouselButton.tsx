import React from 'react';
import { twMerge } from 'tailwind-merge';
import { LabelPairedChevronLeftMdRegularIcon, LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';

type TPrevNextButtonProps = {
    enabled: boolean;
    isNext?: boolean;
    onClick: () => void;
};

const CFDCompareAccountsCarouselButton = ({ enabled, isNext = false, onClick }: TPrevNextButtonProps) => (
    <button
        className={twMerge(
            'bg-system-light-primary-background z-10 absolute flex items-center justify-center top-1/2 cursor-pointer w-40 h-40 rounded-[50%] disabled:opacity-8 disabled:hidden border-0 shadow-7',
            isNext && 'right-16',
            !isNext && 'left-16'
        )}
        disabled={!enabled}
        onClick={onClick}
    >
        {isNext ? <LabelPairedChevronRightMdRegularIcon /> : <LabelPairedChevronLeftMdRegularIcon />}
    </button>
);
export default CFDCompareAccountsCarouselButton;

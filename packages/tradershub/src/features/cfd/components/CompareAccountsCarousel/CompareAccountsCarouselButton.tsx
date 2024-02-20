import React from 'react';
import { clsx } from 'clsx';
import { LabelPairedChevronLeftMdRegularIcon, LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';

type TPrevNextButtonProps = {
    enabled: boolean;
    isNext?: boolean;
    onClick: () => void;
};

const CFDCompareAccountsCarouselButton = ({ enabled, isNext = false, onClick }: TPrevNextButtonProps) => (
    <Button
        className={clsx(
            'bg-system-light-primary-background z-10 absolute lg:flex items-center justify-center top-1/2 cursor-pointer w-40 h-40 rounded-[50%] border-solid-coral-100 border-solid border-1 disabled:opacity-8 disabled:hidden',
            isNext && 'right-16',
            !isNext && 'left-16'
        )}
        color='white'
        disabled={!enabled}
        onClick={onClick}
        size='md'
        variant='outlined'
    >
        {isNext ? <LabelPairedChevronRightMdRegularIcon /> : <LabelPairedChevronLeftMdRegularIcon />}
    </Button>
);
export default CFDCompareAccountsCarouselButton;

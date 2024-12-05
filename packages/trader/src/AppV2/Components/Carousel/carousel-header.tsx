import React from 'react';
import { ActionSheet } from '@deriv-com/quill-ui';
import { LabelPairedArrowLeftMdRegularIcon, LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';

export type TQuillIcon = typeof LabelPairedArrowLeftMdRegularIcon;
type TCarouselHeaderProps = {
    current_index: number;
    onNextClick: () => void;
    onPrevClick: () => void;
    previous_icon?: TQuillIcon;
    next_icon?: TQuillIcon;
    title?: React.ReactNode;
};

const CarouselHeader = ({
    current_index,
    onNextClick,
    onPrevClick,
    previous_icon,
    next_icon,
    title,
}: TCarouselHeaderProps) => {
    const NextIcon = next_icon ?? LabelPairedCircleInfoMdRegularIcon;
    const PreviousIcon = previous_icon ?? LabelPairedArrowLeftMdRegularIcon;

    return (
        <ActionSheet.Header
            className='carousel-controls'
            title={title}
            icon={current_index ? <PreviousIcon onClick={onPrevClick} /> : <NextIcon onClick={onNextClick} />}
            iconPosition={current_index ? 'left' : 'right'}
        />
    );
};

export default CarouselHeader;

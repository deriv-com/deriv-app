import React from 'react';
import { ActionSheet } from '@deriv-com/quill-ui';
import { LabelPairedArrowLeftMdRegularIcon, LabelPairedCircleInfoMdRegularIcon } from '@deriv/quill-icons';

type TCarouselHeaderProps = {
    current_index: number;
    onNextClick: () => void;
    onPrevClick: () => void;
    title?: React.ReactNode;
};

const CarouselHeader = ({ current_index, onNextClick, onPrevClick, title }: TCarouselHeaderProps) => (
    <ActionSheet.Header
        className='carousel-controls'
        title={title}
        icon={
            current_index ? (
                <LabelPairedArrowLeftMdRegularIcon onClick={onPrevClick} />
            ) : (
                <LabelPairedCircleInfoMdRegularIcon onClick={onNextClick} />
            )
        }
        iconPosition={current_index ? 'left' : 'right'}
    />
);

export default CarouselHeader;

import React, { memo } from 'react';
import { Rating } from 'react-simple-star-rating';
import { LabelPairedStarLgFillIcon, LabelPairedStarLgRegularIcon } from '@deriv/quill-icons';
import './StarRating.scss';

type TStarRatingProps = {
    initialValue?: number;
    isReadonly?: boolean;
    onClick?: () => void;
    ratingValue: number;
    starsScale?: number;
};

const StarRating = ({
    initialValue = 0,
    isReadonly = false,
    onClick,
    ratingValue,
    starsScale = 1,
}: TStarRatingProps) => {
    // Converts initial value to be in the form of x.0 or x.5
    // to show full and half stars only
    const fractionalizedValue = Math.round(initialValue * 2) / 2;

    return (
        <Rating
            allowHalfIcon
            allowHover={false}
            className='p2p-v2-star-rating'
            emptyIcon={<LabelPairedStarLgRegularIcon fill='#FFAD3A' />}
            fullIcon={<LabelPairedStarLgFillIcon fill='#FFAD3A' />}
            iconsCount={5}
            initialValue={ratingValue}
            onClick={onClick}
            ratingValue={fractionalizedValue}
            readonly={isReadonly}
            size={12}
            style={{ transform: `scale(${starsScale})` }}
        />
    );
};

export default memo(StarRating);

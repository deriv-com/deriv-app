import React from 'react';
import { Rating } from 'react-simple-star-rating';
import EmptyStarIcon from '../../public/ic-empty-star.svg';
import FullStarIcon from '../../public/ic-full-star.svg';
import './StarRating.scss';

type TStarRatingProps = {
    initialValue?: number;
    isReadonly?: boolean;
    onClick?: () => void;
    ratingValue: number;
    size?: number;
};

const StarRating = ({ initialValue = 0, isReadonly = false, onClick, ratingValue }: TStarRatingProps) => {
    // Converts initial value to be in the form of x.0 or x.5
    // to show full and half stars only
    const fractionalizedValue = Math.round(initialValue * 2) / 2;

    return (
        <Rating
            allowHalfIcon
            allowHover={false}
            className='p2p-v2-star-rating'
            emptyIcon={<EmptyStarIcon scale={0.5} />}
            fullIcon={<FullStarIcon scale={0.5} />}
            iconsCount={5}
            initialValue={ratingValue}
            onClick={onClick}
            ratingValue={fractionalizedValue}
            readonly={isReadonly}
            size={12}
        />
    );
};

export default memo(StarRating);

import React from 'react';
import { StarRating } from '../../../../components';
import './MyProfileRating.scss';

type TMyProfileRatingProps = {
    rating: number;
    totalCount: number;
};
const MyProfileRating = ({ rating, totalCount }: TMyProfileRatingProps) => {
    return (
        <div className='p2p-v2-my-profile-rating'>
            <StarRating ratingValue={rating} />
            <h2>({totalCount} ratings)</h2>
        </div>
    );
};

export default MyProfileRating;

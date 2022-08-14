import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';
import UserRatingButton from 'Components/user-rating-button';
import StarRating from 'Components/star-rating';

const RatingCellRenderer = ({ is_reviewable, rating, review_details, onClickUserRatingButton }) => {
    return review_details ? (
        <div className='rating-cell-renderer'>
            <StarRating
                empty_star_className='rating-cell-renderer--star'
                empty_star_icon='IcEmptyStar'
                full_star_className='rating-cell-renderer--star'
                full_star_icon='IcFullStar'
                initial_value={rating}
                is_readonly
                number_of_stars={5}
                should_allow_hover_effect={false}
                star_size={15}
            />
        </div>
    ) : (
        <UserRatingButton
            button_text={localize('Rate')}
            is_disabled={!is_reviewable}
            onClick={onClickUserRatingButton}
        />
    );
};

RatingCellRenderer.propTypes = {
    is_reviewable: PropTypes.bool,
    rating: PropTypes.number,
    review_details: PropTypes.object,
    onClickUserRatingButton: PropTypes.func,
};

export default RatingCellRenderer;

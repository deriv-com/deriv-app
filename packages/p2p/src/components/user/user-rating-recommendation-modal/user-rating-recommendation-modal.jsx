import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, Modal, Text, Rating } from '@deriv/components';
import { localize } from 'Components/i18next';
import { user_recommendation as Recommendation } from 'Constants/user-recommendation.js';

const UserRatingRecommendationModal = ({ onClick, is_open, rating, recommendation, user_type }) => {
    const [user_rating, setUserRating] = React.useState(0);
    const [user_recommendation, setUserRecommendation] = React.useState(null);

    const handleModalAction = action_status => {
        if (action_status) {
            onClick({ rating: user_rating, recommendation: user_recommendation });
        } else {
            onClick({ rating, recommendation });
        }
    };

    React.useEffect(() => {
        setUserRating(rating);
        setUserRecommendation(recommendation);
    }, [rating, recommendation]);

    return (
        <Modal
            has_close_icon={!!user_rating}
            is_open={is_open}
            small
            title={localize('How would you rate this transaction?')}
            toggleModal={() => handleModalAction(false)}
        >
            <Modal.Body>
                <div className='user-rating-recommendation__layout--vertical'>
                    <Rating
                        value={user_rating}
                        icon_selected={<Icon icon='IcStarFilled' size={16} custom_color='var(--status-warning)' />}
                        icon_unselected={<Icon icon='IcStarUnfilled' size={16} custom_color='var(--status-default)' />}
                        onClick={setUserRating}
                    />
                    {user_rating && (
                        <section className='user-rating-recommendation__layout--vertical'>
                            <Text>{localize('Would you recommend this {{user_type}}', { user_type })}</Text>
                            <div className='user-rating-recommendation__layout--horizontal'>
                                <Button small transparent>
                                    <div className='user-rating-recommendation__layout--horizontal'>
                                        <Icon
                                            icon='IcThumbsUp'
                                            size={14}
                                            custom_color={
                                                user_recommendation === Recommendation.YES
                                                    ? 'var(--text-prominent)'
                                                    : 'var(--status-unselect)'
                                            }
                                        />
                                        {localize('Yes')}
                                    </div>
                                </Button>
                                <Button small transparent>
                                    <div className='user-rating-recommendation__layout--horizontal'>
                                        <Icon
                                            icon='IcThumbsDown'
                                            size={14}
                                            custom_color={
                                                user_recommendation === Recommendation.NO
                                                    ? 'var(--text-prominent)'
                                                    : 'var(--status-unselect)'
                                            }
                                        />
                                        {localize('No')}
                                    </div>
                                </Button>
                            </div>
                        </section>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className='user-rating-recommendation__footer'>
                {user_rating ? (
                    <Button
                        has_effect
                        text={localize('Done')}
                        onClick={() => handleModalAction(true)}
                        primary
                        large
                        type='button'
                    />
                ) : (
                    <Button
                        has_effect
                        text={localize('Skip')}
                        onClick={() => handleModalAction(false)}
                        secondary
                        large
                        type='button'
                    />
                )}
            </Modal.Footer>
        </Modal>
    );
};

UserRatingRecommendationModal.propTypes = {
    is_open: PropTypes.bool,
    onClick: PropTypes.func,
    rating: PropTypes.number,
    recommendation: PropTypes.oneOf(['yes', 'no']),
    user_type: PropTypes.string,
};

export default UserRatingRecommendationModal;

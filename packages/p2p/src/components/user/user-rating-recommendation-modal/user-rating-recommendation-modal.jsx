import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, Modal, Text, Rating } from '@deriv/components';
import { localize } from 'Components/i18next';
import classNames from 'classnames';

const UserRatingRecommendationModal = ({ onClick, is_open, rating, recommendation, user_type }) => {
    const [user_rating, setUserRating] = React.useState(0);
    const [user_recommendation, setUserRecommendation] = React.useState(null);

    const handleModalAction = action_status =>
        action_status ? onClick({ rating: user_rating, recommendation: user_recommendation }) : onClick(null);

    React.useEffect(() => {
        setUserRating(rating);
        setUserRecommendation(recommendation);
    }, [rating, recommendation]);

    const resetRecommendationValue = () => {
        setUserRating(0);
        setUserRecommendation(null);
    };

    const setButtonStyle = (is_recommended, color_select, color_unselect) => {
        if (user_recommendation === 0 || user_recommendation === 1) {
            if (is_recommended) {
                return user_recommendation ? color_select : color_unselect;
            }
            return user_recommendation ? color_unselect : color_select;
        }
        return color_unselect;
    };

    return (
        <Modal
            has_close_icon={!!user_rating}
            is_open={is_open}
            small
            title={localize('How would you rate this transaction?')}
            toggleModal={() => handleModalAction(false)}
            onUnmount={resetRecommendationValue}
        >
            <Modal.Body>
                <div className='user-rating-recommendation__layout--vertical' style={{ gap: '2.9rem' }}>
                    <Rating
                        value={user_rating}
                        icon_selected={<Icon icon='IcStar' size={22} custom_color='var(--status-warning)' />}
                        icon_unselected={<Icon icon='IcStarOutline' size={22} custom_color='var(--status-warning)' />}
                        onClick={setUserRating}
                    />
                    {!!user_rating && (
                        <section className='user-rating-recommendation__layout--vertical' style={{ gap: '1.9rem' }}>
                            <Text size='xs'>{localize('Would you recommend this {{user_type}}', { user_type })}</Text>
                            <div className='user-rating-recommendation__layout--buttons'>
                                <Button
                                    small
                                    secondary
                                    onClick={() => setUserRecommendation(1)}
                                    className={
                                        (classNames('user-rating-recommendation__button'),
                                        setButtonStyle(
                                            1,
                                            'user-rating-recommendation__button--border-active-recommend',
                                            'user-rating-recommendation__button--border-inactive'
                                        ))
                                    }
                                    classNameSpan='user-rating-recommendation__button--text'
                                >
                                    <Icon
                                        icon='IcThumbsUp'
                                        size={14}
                                        custom_color={setButtonStyle(
                                            1,
                                            'var(--status-recommend)',
                                            'var(--status-unselect)'
                                        )}
                                    />
                                    <Text size='xxs' color={setButtonStyle(1, 'recommend', 'unselect')}>
                                        {localize('Yes')}
                                    </Text>
                                </Button>
                                <Button
                                    small
                                    secondary
                                    onClick={() => setUserRecommendation(0)}
                                    className={
                                        (classNames('user-rating-recommendation__button'),
                                        setButtonStyle(
                                            0,
                                            'user-rating-recommendation__button--border-active-reject',
                                            'user-rating-recommendation__button--border-inactive'
                                        ))
                                    }
                                    classNameSpan='user-rating-recommendation__button--text'
                                >
                                    <Icon
                                        icon='IcThumbsDown'
                                        size={14}
                                        custom_color={setButtonStyle(
                                            0,
                                            'var(--status-reject)',
                                            'var(--status-unselect)'
                                        )}
                                    />
                                    <Text size='xxs' color={setButtonStyle(0, 'reject', 'unselect')}>
                                        {localize('No')}
                                    </Text>
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
    recommendation: PropTypes.oneOf([0, 1]),
    user_type: PropTypes.string,
};

export default UserRatingRecommendationModal;

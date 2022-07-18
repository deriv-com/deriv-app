import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from 'Components/i18next';
import StarRating from 'Components/star-rating';
import RecommendUser from '../recommend-user';

const RatingModal = ({
    is_buy_order_for_user,
    is_rating_modal_open,
    onClickDone,
    onClickNotRecommended,
    onClickRecommended,
    onClickSkip,
    onClickStar,
    rating_value,
}) => {
    return (
        <Modal
            has_close_icon={false}
            is_open={is_rating_modal_open}
            title={localize('How would you rate this transaction?')}
        >
            <Modal.Body className='rating-modal--body'>
                <StarRating
                    empty_star_className='rating-modal--star'
                    empty_star_icon='IcEmptyStar'
                    full_star_className='rating-modal--star'
                    full_star_icon='IcFullStar'
                    number_of_stars={5}
                    onClick={onClickStar}
                    rating_value={rating_value}
                    should_allow_half_icon={false}
                    star_size={isMobile() ? 17 : 20}
                />
                {rating_value > 0 && (
                    <RecommendUser
                        is_buy_order_for_user={is_buy_order_for_user}
                        onClickNotRecommended={onClickNotRecommended}
                        onClickRecommended={onClickRecommended}
                    />
                )}
            </Modal.Body>
            <Modal.Footer className='rating-modal--footer'>
                {rating_value > 0 ? (
                    <Button primary large onClick={onClickDone}>
                        <Localize i18n_default_text='Done' />
                    </Button>
                ) : (
                    <Button secondary large onClick={onClickSkip}>
                        <Localize i18n_default_text='Skip' />
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

RatingModal.propTypes = {
    is_buy_order_for_user: PropTypes.bool,
    is_rating_modal_open: PropTypes.bool,
    onClickDone: PropTypes.func,
    onClickNotRecommended: PropTypes.func,
    onClickRecommended: PropTypes.func,
    onClickSkip: PropTypes.func,
    onClickStar: PropTypes.func,
    rating_value: PropTypes.number,
};

export default RatingModal;

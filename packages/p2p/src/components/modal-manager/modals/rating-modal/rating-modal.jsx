import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from 'Components/i18next';
import StarRating from 'Components/star-rating';
import RecommendUser from 'Components/recommend-user';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const RatingModal = ({ is_buy_order_for_user, is_user_recommended_previously, onClickDone, onClickSkip }) => {
    const { order_store } = useStores();
    const { is_modal_open } = useModalManagerContext();

    const onClickClearRecommendation = () => order_store.setIsRecommended(null);
    const onClickNotRecommended = () => order_store.setIsRecommended(0);
    const onClickRecommended = () => order_store.setIsRecommended(1);

    return (
        <Modal
            has_close_icon={order_store.rating_value > 0}
            is_open={is_modal_open}
            title={localize('How would you rate this transaction?')}
            toggleModal={onClickSkip}
            width={isMobile() && '90vw'}
        >
            <Modal.Body className='rating-modal--body'>
                <div className='rating-modal--body__star'>
                    <StarRating
                        empty_star_className='rating-modal--star'
                        empty_star_icon='IcEmptyStar'
                        full_star_className='rating-modal--star'
                        full_star_icon='IcFullStar'
                        initial_value={0}
                        number_of_stars={5}
                        onClick={order_store.handleRating}
                        rating_value={order_store.rating_value}
                        should_allow_half_icon={false}
                        star_size={isMobile() ? 25 : 20}
                    />
                </div>
                {order_store.rating_value > 0 && (
                    <RecommendUser
                        is_buy_order_for_user={is_buy_order_for_user}
                        is_user_recommended_previously={is_user_recommended_previously}
                        onClickClearRecommendation={onClickClearRecommendation}
                        onClickNotRecommended={onClickNotRecommended}
                        onClickRecommended={onClickRecommended}
                    />
                )}
            </Modal.Body>
            <Modal.Footer className='rating-modal--footer'>
                {order_store.rating_value > 0 ? (
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
    is_user_recommended_previously: PropTypes.number,
    onClickDone: PropTypes.func,
    onClickSkip: PropTypes.func,
    onClickStar: PropTypes.func,
};

export default observer(RatingModal);

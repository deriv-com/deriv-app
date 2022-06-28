import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import StarRating from 'Components/star-rating';

const OrdersUserRatingModal = () => {
    return (
        <Modal
            has_close_icon={false}
            is_open={true}
            small
            title={
                <Text color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='How would you rate this transaction?' />
                </Text>
            }
        >
            <Modal.Body>
                <StarRating
                    empty_star_className='advertiser-page__rating--star'
                    empty_star_icon='IcEmptyStar'
                    full_star_className='advertiser-page__rating--star'
                    full_star_icon='IcFullStar'
                    initial_value={0}
                    is_readonly
                    number_of_stars={5}
                    should_allow_hover_effect={false}
                    star_size={20}
                />
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='Would you recommend this seller?' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button secondary large>
                    <Localize i18n_default_text='Skip' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(OrdersUserRatingModal);

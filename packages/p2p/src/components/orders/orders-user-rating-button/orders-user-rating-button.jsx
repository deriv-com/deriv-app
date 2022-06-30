import React from 'react';
import { Button, Icon } from '@deriv/components';
import { Localize } from 'Components/i18next';
import './orders-user-rating-button.scss';

const OrdersUserRatingButton = ({ has_full_text }) => {
    return (
        <Button secondary small className='orders-user-rating-button'>
            <Icon icon='IcFullStar' className='orders-user-rating-button-icon' />
            {has_full_text ? (
                <Localize i18n_default_text='Rate this transaction' />
            ) : (
                <Localize i18n_default_text='Rate' />
            )}
        </Button>
    );
};

export default OrdersUserRatingButton;

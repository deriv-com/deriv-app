import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@deriv/components';
import { Localize } from 'Components/i18next';

const UserRatingButton = ({ has_full_text, is_disabled }) => {
    return (
        <Button is_disabled={is_disabled} secondary small className='user-rating-button'>
            <Icon icon='IcFullStar' className='user-rating-button-icon' color={is_disabled && 'disabled'} size={12} />
            {has_full_text ? (
                <Localize i18n_default_text='Rate this transaction' />
            ) : (
                <Localize i18n_default_text='Rate' />
            )}
        </Button>
    );
};

UserRatingButton.PropTypes = {
    has_full_text: PropTypes.bool,
    is_disabled: PropTypes.bool,
};

export default UserRatingButton;

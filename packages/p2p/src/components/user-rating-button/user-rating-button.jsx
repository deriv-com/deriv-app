import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Icon, Text } from '@deriv/components';

const UserRatingButton = ({ button_text, is_disabled, large, onClick }) => {
    return (
        <Button
            className={classNames('user-rating-button', { 'user-rating-button--big': large })}
            is_disabled={is_disabled}
            secondary
            small
            onClick={is_disabled ? () => {} : onClick}
        >
            <Icon icon='IcFullStar' className='user-rating-button--icon' color={is_disabled && 'disabled'} size={12} />
            <Text color='prominent' size='xxs' weight={large ? 'normal' : 'bold'}>
                {button_text}
            </Text>
        </Button>
    );
};

UserRatingButton.propTypes = {
    button_text: PropTypes.string,
    is_disabled: PropTypes.bool,
    large: PropTypes.bool,
    onClick: PropTypes.func,
};

export default UserRatingButton;

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';

const Header = ({ balance, header, button_text, header_icon, onButtonClick, text_color, title }) => {
    return (
        <div className='dc-popup__header'>
            <Text size='s' as='p' styles={{ color: text_color }}>
                {title}
            </Text>
            <div className='dc-popup__header--content'>
                <Text size='m' weight='bold' styles={{ color: text_color }}>
                    {balance}
                </Text>
                {button_text && (
                    <Button
                        rounded
                        primary
                        className='dc-popup__header__button'
                        icon={<Icon icon='IcPlay' size={10} color='active' />}
                        text={button_text}
                        onClick={onButtonClick}
                    />
                )}
                {header_icon && <Icon icon={header_icon} size={50} className='dc-popup__header__icon' />}
            </div>
        </div>
    );
};

Header.propTypes = {
    balance: PropTypes.string,
    button_text: PropTypes.string,
    header_icon: PropTypes.string,
    onButtonClick: PropTypes.func,
    text_color: PropTypes.string,
    title: PropTypes.string,
};

export default Header;

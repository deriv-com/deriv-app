import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';
import Text from '../text';

const Header = ({ balance, header, header_icon, text_color, title }) => {
    return header ? (
        header()
    ) : (
        <div>
            <Text size='s' as='p' styles={{ color: text_color }}>
                {title}
            </Text>
            <div className='dc-popup__header'>
                <Text size='m' weight='bold' styles={{ color: text_color }}>
                    {balance}
                </Text>
                {header_icon && <Icon icon={header_icon} size={50} className='dc-popup__header__icon' />}
            </div>
        </div>
    );
};

Header.propTypes = {
    balance: PropTypes.string,
    header: PropTypes.func,
    header_icon: PropTypes.string,
    text_color: PropTypes.string,
    title: PropTypes.string,
};

export default Header;

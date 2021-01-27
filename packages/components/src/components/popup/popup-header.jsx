import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import DesktopWrapper from '../desktop-wrapper';
import Icon from '../icon';
import MobileWrapper from '../mobile-wrapper';
import Text from '../text';

const Header = ({
    balance,
    banner_text,
    button_text,
    close_icon_color,
    header_icon,
    onButtonClick,
    text_color,
    title,
    togglePopupModal,
}) => {
    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='dc-popup-header'>
                    <Text size='s' as='p' styles={{ color: text_color }}>
                        {title}
                    </Text>
                    <div className='dc-popup-header__content'>
                        <Text size='m' weight='bold' styles={{ color: text_color }}>
                            {balance}
                        </Text>
                        {button_text && (
                            <Button
                                rounded
                                primary
                                className='dc-popup-header__button'
                                icon={<Icon icon='IcPlay' size={10} color='active' />}
                                text={button_text}
                                onClick={onButtonClick}
                            />
                        )}
                        {header_icon && <Icon icon={header_icon} size={120} className='dc-popup-header__icon' />}
                    </div>
                    {banner_text && (
                        <div className='dc-popup-header__banner'>
                            <Text size='xxxs' weight='bold' color='--text-prominent'>
                                {banner_text}
                            </Text>
                        </div>
                    )}
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <div className='dc-popup-header'>
                    <div className='dc-popup-header__title'>
                        <Text size='xs' styles={{ color: text_color, display: 'flex', alignItems: 'center' }}>
                            {title}
                            {banner_text && (
                                <div className='dc-popup-header__banner'>
                                    <Text size='xxxxs'>{banner_text}</Text>
                                </div>
                            )}
                            {header_icon && <Icon icon={header_icon} size={90} className='dc-popup-header__icon' />}
                        </Text>
                        <div onClick={togglePopupModal} className='dc-popup-header__close-icon'>
                            <Icon icon='IcCross' color={close_icon_color} />
                        </div>
                    </div>
                    <div className='dc-popup-header__content'>
                        <Text size='xsm' weight='bold' styles={{ color: text_color }}>
                            {balance}
                        </Text>
                        {button_text && (
                            <Button
                                primary
                                is_circle
                                className='dc-popup-header__button'
                                icon={<Icon icon='IcPlay' size={10} color='active' />}
                                onClick={onButtonClick}
                            />
                        )}
                    </div>
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

Header.propTypes = {
    balance: PropTypes.string,
    banner_text: PropTypes.string,
    button_text: PropTypes.string,
    close_icon_color: PropTypes.string,
    header_icon: PropTypes.string,
    onButtonClick: PropTypes.func,
    text_color: PropTypes.string,
    title: PropTypes.string,
    togglePopupModal: PropTypes.func,
};

export default Header;

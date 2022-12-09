import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Body from './mobile-drawer-body.jsx';
import Footer from './mobile-drawer-footer.jsx';
import SubHeader from './mobile-drawer-subheader.jsx';
import Item from './mobile-drawer-item.jsx';
import SubMenu from './mobile-drawer-submenu.jsx';
import SubMenuSection from './mobile-drawer-submenu-section.jsx';
import Text from '../text/text';
import Icon from '../icon/icon';

const MobileDrawer = ({
    className,
    id,
    height,
    width,
    alignment,
    is_open,
    transitionExit,
    title,
    toggle,
    children,
    livechat: LiveChat,
}) => {
    if (is_open)
        return (
            <>
                <div
                    className={`dc-mobile-drawer__overlay ${transitionExit ? 'exit' : ''}`}
                    onClick={e => {
                        e.stopPropagation();
                        toggle();
                    }}
                />
                <div className={`dc-mobile-drawer ${transitionExit ? 'exit' : ''}`}>
                    <div
                        id={id}
                        className={classNames('dc-mobile-drawer__container', {
                            [`dc-mobile-drawer__container_${className}`]: className,
                        })}
                        style={{
                            height: height || 'auto',
                            width: width || 'auto',
                        }}
                    >
                        <div
                            className={classNames('dc-mobile-drawer__header', {
                                'dc-mobile-drawer__header--right': alignment === 'right',
                                [`dc-mobile-drawer__header--${className}`]: className,
                            })}
                        >
                            <div onClick={toggle} className='dc-mobile-drawer__header-close'>
                                <Icon icon='IcCross' />
                            </div>
                            <div className='dc-mobile-drawer__header-wrapper'>
                                {title && (
                                    <Text
                                        as='h3'
                                        color='prominent'
                                        weight='bold'
                                        className={classNames('dc-mobile-drawer__header-title', {
                                            [`dc-mobile-drawer-header__title--${className}`]: className,
                                        })}
                                    >
                                        {title}
                                    </Text>
                                )}
                                {LiveChat}
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </>
        );
    return <></>;
};

MobileDrawer.defaultProps = {
    alignment: 'left',
};

MobileDrawer.Body = Body;
MobileDrawer.Footer = Footer;
MobileDrawer.Item = Item;
MobileDrawer.SubHeader = SubHeader;
MobileDrawer.SubMenu = SubMenu;
MobileDrawer.SubMenuSection = SubMenuSection;

MobileDrawer.propTypes = {
    alignment: PropTypes.oneOf(['left', 'right']),
    children: PropTypes.node,
    className: PropTypes.string,
    height: PropTypes.string,
    id: PropTypes.string,
    is_open: PropTypes.bool,
    livechat_title: PropTypes.string,
    onClickLivechat: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    toggle: PropTypes.func,
    width: PropTypes.string,
    livechat: PropTypes.object,
};

export default MobileDrawer;

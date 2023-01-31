/* eslint @typescript-eslint/triple-slash-reference: "off" */
/// <reference path="../../../@types/react-drag-drawer/react-drag-drawer-config.d.ts" />
import classNames from 'classnames';
import React from 'react';
import Body from './mobile-drawer-body';
import Footer from './mobile-drawer-footer';
import SubHeader from './mobile-drawer-subheader';
import Item from './mobile-drawer-item';
import SubMenu from './mobile-drawer-submenu';
import SubMenuSection from './mobile-drawer-submenu-section';
import Text from '../text/text';
import Icon from '../icon/icon';

type TMobileDrawer = {
    className: string;
    id?: string;
    height: string;
    width: string;
    alignment: 'left' | 'right';
    is_open: boolean;
    title: string;
    toggle: () => void;
    livechat: React.ReactElement;
    transitionExit: boolean;
};

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
}: React.PropsWithChildren<TMobileDrawer>) => {
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

MobileDrawer.Body = Body;
MobileDrawer.Footer = Footer;
MobileDrawer.Item = Item;
MobileDrawer.SubHeader = SubHeader;
MobileDrawer.SubMenu = SubMenu;
MobileDrawer.SubMenuSection = SubMenuSection;

export default MobileDrawer;

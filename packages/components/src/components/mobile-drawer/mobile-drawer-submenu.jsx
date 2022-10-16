import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Text from '../text/text';
import Icon from '../icon/icon';

const SubMenu = ({
    children,
    has_subheader,
    onToggle,
    submenu_toggle_class,
    submenu_icon,
    submenu_title,
    submenu_suffix_icon,
    route_config_path,
}) => {
    const [is_expanded, setIsExpanded] = React.useState(false);

    const toggleMenu = () => {
        const should_expanded = !is_expanded;
        setIsExpanded(should_expanded);
        if (onToggle) {
            onToggle(should_expanded);
        }
    };
    return (
        <React.Fragment>
            <div className={classNames('dc-mobile-drawer__submenu-toggle', submenu_toggle_class)} onClick={toggleMenu}>
                {submenu_icon && <Icon className='dc-mobile-drawer__submenu-toggle-icon' icon={submenu_icon} />}
                {submenu_title && (
                    <Text
                        as='h3'
                        size='xs'
                        weight={window.location.pathname.startsWith(route_config_path) ? 'bold' : null}
                    >
                        {submenu_title}
                    </Text>
                )}
                {submenu_suffix_icon && (
                    <Icon className='dc-mobile-drawer__submenu-toggle-suffix-icon' icon={submenu_suffix_icon} />
                )}
            </div>
            <SubMenuList
                collapse={toggleMenu}
                has_subheader={has_subheader}
                is_expanded={is_expanded}
                submenu_title={submenu_title}
            >
                {children}
            </SubMenuList>
        </React.Fragment>
    );
};

SubMenu.propTypes = {
    children: PropTypes.node,
    has_subheader: PropTypes.bool,
    submenu_icon: PropTypes.string,
    submenu_suffix_icon: PropTypes.string,
    submenu_title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    submenu_toggle_class: PropTypes.string,
    onToggle: PropTypes.func,
    route_config_path: PropTypes.string,
};

const SubMenuList = ({ children, collapse, has_subheader, is_expanded, submenu_title }) => (
    <CSSTransition
        in={is_expanded}
        classNames={{
            enter: 'dc-mobile-drawer__submenu-list--enter',
            enterDone: 'dc-mobile-drawer__submenu-list--enter-done',
            exit: 'dc-mobile-drawer__submenu-list--exit',
        }}
        timeout={250}
        unmountOnExit
    >
        <div
            className={classNames('dc-mobile-drawer__submenu-list', {
                'dc-mobile-drawer__submenu-list--has-subheader': has_subheader,
            })}
        >
            <div className='dc-mobile-drawer__submenu-list-title' onClick={collapse}>
                <div className='dc-mobile-drawer__submenu-back'>
                    <Icon className='dc-mobile-drawer__submenu-back-icon' icon='IcChevronLeft' />
                </div>
                {submenu_title && (
                    <Text as='h3' weight='bold' color='prominent'>
                        {submenu_title}
                    </Text>
                )}
            </div>
            {children}
        </div>
    </CSSTransition>
);

SubMenuList.propTypes = {
    children: PropTypes.node,
    collapse: PropTypes.func,
    has_subheader: PropTypes.bool,
    is_expanded: PropTypes.bool,
    submenu_title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default SubMenu;

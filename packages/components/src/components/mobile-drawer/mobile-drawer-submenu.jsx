import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Icon from '../icon/icon.jsx';
import Text from '../text/text.jsx';

const SubMenu = ({
    onToggle,
    submenu_toggle_class,
    submenu_icon,
    submenu_title,
    submenu_suffix_icon,
    has_subheader,
    children,
}) => {
    
    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleMenu = () => {
        const is_expanded = !isExpanded;
        setIsExpanded(is_expanded);
        if (onToggle) {
            onToggle(is_expanded);
        }
    };
    return (
        <React.Fragment>
            <div className={classNames('dc-mobile-drawer__submenu-toggle', submenu_toggle_class)} onClick={toggleMenu}>
                {submenu_icon && <Icon className='dc-mobile-drawer__submenu-toggle-icon' icon={submenu_icon} />}
                {submenu_title && (
                    <Text as='h3' size='xs'>
                        {submenu_title}
                    </Text>
                )}
                {submenu_suffix_icon && (
                    <Icon className='dc-mobile-drawer__submenu-toggle-suffix-icon' icon={submenu_suffix_icon} />
                )}
            </div>
            <SubMenuList
                has_subheader={has_subheader}
                is_expanded={isExpanded}
                submenu_title={submenu_title}
                collapse={toggleMenu}
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
};

const SubMenuList = ({ is_expanded, collapse, children, has_subheader, submenu_title }) => (
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

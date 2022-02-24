import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import Icon from '../icon/icon.jsx';
import Text from '../text/text.jsx';

const SubMenu = ({
    children,
    has_subheader,
    onToggle,
    submenu_toggle_class,
    submenu_icon,
    submenu_title,
    submenu_suffix_icon,
    is_bold_text,
    is_current_submenu_item,
    setIsBoldText,
}) => {
    const [is_expanded, setIsExpanded] = React.useState(false);

    console.log('is_current_submenu_item', is_current_submenu_item)

    const default_arr = [
        {id: 0, label: 'Reports', isShowBold: false}, 
        {id: 1, label: 'Account Settings', isShowBold: false}, 
        {id: 2, label: 'Cashier', isShowBold: false}, 
        {id: 3, label: 'Language', isShowBold: false}
    ];

    const toggleProperty = (arr, id, propName) => {
        const idx = arr.findIndex((el) => el.id === id);
        const oldItem = arr[idx];
        const newItem = {...oldItem,
            [propName]: !oldItem[propName]
        };
        console.log('newItem', newItem, [
            ...arr.slice(0, idx),
            newItem,
            ...arr.slice(idx + 1)
        ]);

        return [
            ...arr.slice(0, idx),
            newItem,
            ...arr.slice(idx + 1)
        ];
    }

    const toggleMenu = () => {
        setIsBoldText(toggleProperty(default_arr, is_current_submenu_item.id, 'isShowBold'));
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
                    <Text as='h3' size='xs' weight={is_current_submenu_item.isShowBold ? 'bold' : null}>
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
